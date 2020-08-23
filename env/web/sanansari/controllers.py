from flask import session
import pandas as pd
from datetime import datetime, date
from sanansari import db
from sanansari.models import *
import os
import hashlib
import itertools

def toDict(d):
    try:
        r = dict(d.__dict__)
        r.pop('_sa_instance_state', None)
        return r
    except AttributeError:
        return None

def _convert(usia):
    if 0 <= usia <= 4:
        rentang = 'BALITA'
    elif 5 <= usia <= 11:
        rentang = 'MASA KANAK-KANAN'
    elif 12 <= usia <= 16:
        rentang = 'MASA REMAJA AWAL'
    elif 17 <= usia <= 25:
        rentang = 'MASA REMAJA AKHIR'
    elif 26 <= usia <= 35:
        rentang = 'MASA DEWASA AWAL'
    elif 36 <= usia <= 45:
        rentang = 'MASA DEWASA AKHIR'
    elif 46 <= usia <= 55:
        rentang = 'MASA LANSIA AWAL'
    elif 56 <= usia <= 65:
        rentang = 'MASA LANSIA AKHIR'
    else:
        rentang = 'MASA MANULA'
    return rentang

class WargaController:
    model = Warga()
    PER_PAGE = 50

    def read_for_page(self, page_num):
        _all = self.model.query.paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).items
        has_next = self.model.query.paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_next
        has_prev = self.model.query.paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_prev
        ret = [toDict(x) for x in _all]
        return ret, has_prev, has_next

    def read_all(self):
        _all = self.model.query.all()
        ret = [toDict(x) for x in _all]
        return ret

    def read_by_id(self, id):
        return toDict(self.model.query.get(id))

    def read_by_nik(self, nik):
        return toDict(self.model.query.filter_by(nik=nik).first())

    def read_by_kk(self, kk):
        return [toDict(x) for x in self.model.query.filter(Warga.no_kk==kk).all()]

    def read_by_nama(self, nama):
        search = "%{}%".format(nama)
        return [toDict(x) for x in self.model.query.filter(Warga.nama.like(search)).all()]

    def read_all_suami(self):
        return [toDict(x) for x in self.model.query.filter(db.or_(Warga.hubungan_kk == "KEPALA KELUARGA", Warga.hubungan_kk == "SUAMI")).order_by(Warga.nama).all()]

    def read_all_isteri(self):
        return [toDict(x) for x in self.model.query.filter(db.or_(Warga.hubungan_kk == "ISTERI")).order_by(Warga.nama).all()]

    def read_all_balita(self):
        today = date.today()
        _all = self.model.query.filter(db.or_(Warga.hubungan_kk == "ANAK")).order_by(Warga.nama).all()
        ret = []
        for x in _all:
            tmp = toDict(x)
            s = tmp['tgl_lahir'].split('/')
            usia = today.year - int(s[2])
            if usia <= 5:
                ret.append(tmp)
        return ret

    def create(self, data):
        w = Warga(
            hubungan_kk = data['hubungan_kk'],
            jenis_kelamin = data['jenis_kelamin'],
            no_kk = data['no_kk'],
            nik = data['nik'],
            pekerjaan = data['pekerjaan'],
            agama = data['agama'],
            tgl_lahir = data['tgl_lahir'],
            nama = data['nama'],
            status_kawin = data['status_kawin'],
            pendidikan = data['pendidikan'],
            rt = data['rt']
        )
        db.session.add(w)
        db.session.commit()
    
    def get_rt(self):
        _all = self.model.query.distinct(Warga.rt).all()
        ret = [toDict(x) for x in _all]
        df = pd.DataFrame.from_dict(ret)
        pen = df['rt'].value_counts().to_dict()
        return sorted([x for x in pen.keys()])

    def delete(self, id):
        self.model.query.filter_by(id=id).delete()
        db.session.commit()

    def update(self, data):
        w = self.model.query.get(data['id'])
        for key, value in data.items():
            if hasattr(w, key):
                setattr(w, key, value)
        db.session.commit()

    def import_data(self, filename):
        file = os.path.join('sanansari/uploads', filename)
        df = pd.read_csv(file, header=0)
        try:
            for index, r in df.iterrows():
                w = Warga(
                    hubungan_kk = r['hubungan_kk'],
                    jenis_kelamin = r['jenis_kelamin'],
                    no_kk = r['no_kk'],
                    nik = r['nik'],
                    pekerjaan = r['pekerjaan'],
                    agama = r['agama'],
                    tgl_lahir = r['tgl_lahir'],
                    nama = r['nama'],
                    status_kawin = r['status_kawin'],
                    pendidikan = r['pendidikan'],
                    rt = r['rt']
                )
                db.session.add(w)

        except Exception as e:
            return {
                'status' : False,
                'message' : 'Periksa format dan berkas.'
            }

        db.session.commit()

        return {
                'status' : True,
                'message' : 'Sukses'
            }

    def export_data(self):
        now = datetime.now()
        dt = now.strftime("%d-%m-%Y_%H:%M:%S")
        _name = "warga_"+dt+".xlsx"

        data = self.read_all()
        df = pd.DataFrame.from_dict(data)
        df.drop(['id'], axis=1, inplace=True)
        df.to_excel(os.path.join('sanansari/static/adm/export', _name), sheet_name='sheet1', index=False, columns=['nik','no_kk','nama','jenis_kelamin', 'tgl_lahir', 'hubungan_kk', 'agama', 'pendidikan', 'pekerjaan', 'status_kawin', 'rt'])

        return _name


class PUSController:
    model = PUS()
    PER_PAGE = 50

    def read_for_page(self, tahun, page_num):
        _all = self.model.query.filter_by(tahun=tahun).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).items
        ret = []
        for x in _all:
            r = dict(x.__dict__)
            r.pop('_sa_instance_state', None)
            try:
                r['suami'] = x.suami.nama
                r['isteri'] = x.isteri.nama
                ret.append(r)
            except:
                print(x.id)
                pass

        has_next = self.model.query.filter_by(tahun=tahun).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_next
        has_prev = self.model.query.filter_by(tahun=tahun).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_prev
        return ret, has_prev, has_next
    
    def read_all(self, tahun):
        _all = self.model.query.filter_by(tahun=tahun).all()
        ret = [toDict(x) for x in _all]
        return ret

    def update(self, data):
        w = self.model.query.get(data['id'])
        for key, value in data.items():
            if hasattr(w, key):
                setattr(w, key, value)
        db.session.commit()

    def delete(self, id):
        self.model.query.filter_by(id=id).delete()
        db.session.commit()

    def read_tahun(self):
        _all = db.session.query(PUS.tahun).distinct().all()
        ret = [x[0] for x in _all]
        return ret

    def create(self, r):
        w = PUS(
            nik_suami = r['nik_suami'],
            nik_isteri = r['nik_isteri'],
            jumlah_anak_hidup = r['jumlah_anak_hidup'],
            pengukuran_lila = r['pengukuran_lila'],
            tahun = r['tahun'],
            ket = r['ket'],
            jan = r['jan'],
            feb = r['feb'],
            mar = r['mar'],
            apr = r['apr'],
            mei = r['mei'],
            jun = r['jun'],
            jul = r['jul'],
            ags = r['ags'],
            sep = r['sep'],
            okt = r['okt'],
            nov = r['nov'],
            des = r['des']
        )
        db.session.add(w)
        db.session.commit()

    def import_data(self, filename):
        file = os.path.join('sanansari/uploads', filename)
        df = pd.read_csv(file, header=0)
        try:
            for index, r in df.iterrows():
                w = PUS(
                    nik_suami = r['nik_suami'],
                    nik_isteri = r['nik_isteri'],
                    jumlah_anak_hidup = r['jumlah_anak_hidup'],
                    pengukuran_lila = r['pengukuran_lila'],
                    tahun = r['tahun'],
                    ket = r['ket'],
                    jan = r['jan'],
                    feb = r['feb'],
                    mar = r['mar'],
                    apr = r['apr'],
                    mei = r['mei'],
                    jun = r['jun'],
                    jul = r['jul'],
                    ags = r['ags'],
                    sep = r['sep'],
                    okt = r['okt'],
                    nov = r['nov'],
                    des = r['des']
                )
                db.session.add(w)

        except Exception as e:
            return {
                'status' : False,
                'message' : 'Periksa format dan berkas.'
            }

        db.session.commit()

        return {
                'status' : True,
                'message' : 'Sukses'
            }

    def read_by_id(self, id):
        data = self.model.query.get(id)
        d = toDict(data)
        d['rt'] = data.suami.rt
        d['suami'] = data.suami.nama
        d['isteri'] = data.isteri.nama
        return d

    def export_data(self):
        _all = self.model.query.all()
        ret = []
        for x in _all:
            r = dict(x.__dict__)
            r.pop('_sa_instance_state', None)
            try:
                r['suami'] = x.suami.nama
                r['isteri'] = x.isteri.nama
                ret.append(r)
            except:
                print(x.id)
                pass
        
        now = datetime.now()
        dt = now.strftime("%d-%m-%Y_%H:%M:%S")
        _name = "pus_"+dt+".xlsx"

        df = pd.DataFrame.from_dict(ret)
        df.drop(['id'], axis=1, inplace=True)
        df.to_excel(os.path.join('sanansari/static/adm/export', _name), 
            sheet_name='sheet1', 
            index=False, 
            columns=[
                'nik_suami',
                'suami',
                'nik_isteri',
                'isteri', 
                'jumlah_anak_hidup', 
                'pengukuran_lila', 
                'jan', 
                'feb', 
                'mar', 
                'apr',
                'mei',
                'jun',
                'jul',
                'ags',
                'sep',
                'okt',
                'nov',
                'des',
                'tahun', 
                'ket'
            ]
        )

        return _name
        

class UsiaController:
    PER_PAGE = 50

    def read_for_page(self, page_num):
        today = date.today()
        _all = Warga.query.paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).items
        has_next = Warga.query.paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_next
        has_prev = Warga.query.paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_prev
        ret = []
        for x in _all:
            tmp = toDict(x)
            s = tmp['tgl_lahir'].split('/')
            usia = today.year - int(s[2])
            tmp['usia'] = usia
            tmp['rentang'] = _convert(usia)
            ret.append(tmp)
        return ret, has_prev, has_next
    
    def read_all(self):
        today = date.today()
        _all = Warga.query.all()
        ret = []
        for x in _all:
            try:
                tmp = toDict(x)
                s = tmp['tgl_lahir'].split('/')
                usia = today.year - int(s[2])
                tmp['usia'] = usia
                tmp['rentang'] = _convert(usia)
                ret.append(tmp)
            except:
                continue
        return ret

    def read_by_nama(self, nama):
        today = date.today()
        search = "%{}%".format(nama)
        _all = Warga.query.filter(Warga.nama.like(search)).all()
        ret = []
        for x in _all:
            tmp = toDict(x)
            s = tmp['tgl_lahir'].split('/')
            usia = today.year - int(s[2])
            tmp['usia'] = usia
            tmp['rentang'] = _convert(usia)
            ret.append(tmp)
        return ret


class BalitaController:
    model = Balita()
    PER_PAGE = 50

    def read_for_page(self, bulan, tahun, page_num):
        _all = self.model.query.filter(Balita.tahun==tahun).filter(Balita.bulan==bulan).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).items
        ret = []
        for x in _all:
            r = dict(x.__dict__)
            r.pop('_sa_instance_state', None)
            try:
                r['anak'] = x.anak.nama
                r['ibu'] = x.ibu.nama
                r['rt'] = x.ibu.rt
                ret.append(r)
            except:
                print(x.id)
                pass

        has_next = self.model.query.filter(Balita.tahun==tahun).filter(Balita.bulan==bulan).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_next
        has_prev = self.model.query.filter(Balita.tahun==tahun).filter(Balita.bulan==bulan).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_prev
        return ret, has_prev, has_next

    def import_data(self, filename):
        file = os.path.join('sanansari/uploads', filename)
        df = pd.read_csv(file, header=0)
        try:
            for index, r in df.iterrows():
                w = Balita(
                    nik_anak = r['nik_anak'],
                    nik_ibu = r['nik_ibu'],
                    anak_ke = r['anak_ke'],
                    bb = r['bb'],
                    tb = r['tb'],
                    asi = r['asi'],
                    vit_a = r['vit_a'],
                    bulan = r['bulan'],
                    tahun = r['tahun']
                )
                db.session.add(w)

        except Exception as e:
            return {
                'status' : False,
                'message' : e
            }

        db.session.commit()
        return {
                'status' : True,
                'message' : 'Sukses'
            }

    def export_data(self):
        _all = self.model.query.all()
        ret = []
        for x in _all:
            r = dict(x.__dict__)
            r.pop('_sa_instance_state', None)
            try:
                r['anak'] = x.anak.nama
                r['ibu'] = x.ibu.nama
                ret.append(r)
            except:
                print(x.id)
                pass
        
        now = datetime.now()
        dt = now.strftime("%d-%m-%Y_%H:%M:%S")
        _name = "balita_"+dt+".xlsx"

        df = pd.DataFrame.from_dict(ret)
        df.drop(['id'], axis=1, inplace=True)
        df.to_excel(os.path.join('sanansari/static/adm/export', _name), 
            sheet_name='sheet1', 
            index=False, 
            columns=[
                'nik_anak',
                'anak',
                'nik_ibu',
                'ibu', 
                'anak_ke', 
                'bb', 
                'tb', 
                'asi', 
                'vit_a', 
                'bulan',
                'tahun'
            ]
        )
        return _name

    def read_tahun(self):
        _all = db.session.query(Balita.tahun).distinct().all()
        ret = [x[0] for x in _all]
        return ret

    def read_by_id(self, id):
        data = self.model.query.get(id)
        d = toDict(data)
        d['rt'] = data.ibu.rt
        d['anak'] = data.anak.nama
        d['ibu'] = data.ibu.nama
        return d

    def delete(self, id):
        self.model.query.filter_by(id=id).delete()
        db.session.commit()

    def update(self, data):
        w = self.model.query.get(data['id'])
        for key, value in data.items():
            if hasattr(w, key):
                setattr(w, key, value)
        db.session.commit()

    def create(self, data):
        w = Balita(
            bulan = data['bulan'],
            tahun = data['tahun'],
            nik_anak = data['nik_anak'],
            nik_ibu = data['nik_ibu'],
            anak_ke = data['anak_ke'],
            bb = data['bb'],
            tb = data['tb'],
            asi = data['asi'],
            vit_a = data['vit_a']
        )
        db.session.add(w)
        db.session.commit()


class HamilController:
    model = Hamil()
    PER_PAGE = 50

    def read_for_page(self, bulan, tahun, page_num):
        _all = self.model.query.filter(Hamil.tahun==tahun).filter(Hamil.bulan==bulan).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).items
        ret = []
        for x in _all:
            r = dict(x.__dict__)
            r.pop('_sa_instance_state', None)
            try:
                r['suami'] = x.suami.nama
                r['ibu'] = x.ibu.nama
                r['rt'] = x.ibu.rt
                ret.append(r)
            except:
                print(x.id)
                pass

        has_next = self.model.query.filter(Hamil.tahun==tahun).filter(Hamil.bulan==bulan).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_next
        has_prev = self.model.query.filter(Hamil.tahun==tahun).filter(Hamil.bulan==bulan).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_prev
        return ret, has_prev, has_next

    def import_data(self, filename):
        file = os.path.join('sanansari/uploads', filename)
        df = pd.read_csv(file, header=0)
        try:
            for index, r in df.iterrows():
                w = Hamil(
                    nik_suami = r['nik_suami'],
                    nik_ibu = r['nik_ibu'],
                    anak_ke = r['anak_ke'],
                    jarak = r['jarak'],
                    haid = r['haid'],
                    ket = r['ket'],
                    bulan = r['bulan'],
                    tahun = r['tahun']
                )
                db.session.add(w)

        except Exception as e:
            return {
                'status' : False,
                'message' : e
            }

        db.session.commit()
        return {
                'status' : True,
                'message' : 'Sukses'
            }
    
    def export_data(self):
        _all = self.model.query.all()
        ret = []
        for x in _all:
            r = dict(x.__dict__)
            r.pop('_sa_instance_state', None)
            try:
                r['suami'] = x.suami.nama
                r['ibu'] = x.ibu.nama
                r['rt'] = x.ibu.rt
                ret.append(r)
            except:
                print(x.id)
                pass
        
        now = datetime.now()
        dt = now.strftime("%d-%m-%Y_%H:%M:%S")
        _name = "hamil_"+dt+".xlsx"

        df = pd.DataFrame.from_dict(ret)
        df.drop(['id'], axis=1, inplace=True)
        df.to_excel(os.path.join('sanansari/static/adm/export', _name), 
            sheet_name='sheet1', 
            index=False, 
            columns=[
                'nik_suami',
                'suami',
                'nik_ibu',
                'ibu', 
                'anak_ke', 
                'jarak', 
                'haid', 
                'ket', 
                'bulan', 
                'tahun'
            ]
        )
        return _name

    def read_tahun(self):
        _all = db.session.query(Hamil.tahun).distinct().all()
        ret = [x[0] for x in _all]
        return ret

    def read_by_id(self, id):
        data = self.model.query.get(id)
        d = toDict(data)
        d['rt'] = data.suami.rt
        d['suami'] = data.suami.nama
        d['ibu'] = data.ibu.nama
        return d

    def delete(self, id):
        self.model.query.filter_by(id=id).delete()
        db.session.commit()

    def update(self, data):
        w = self.model.query.get(data['id'])
        for key, value in data.items():
            if hasattr(w, key):
                setattr(w, key, value)
        db.session.commit()

    def create(self, r):
        w = Hamil(
            nik_suami = r['nik_suami'],
            nik_ibu = r['nik_ibu'],
            anak_ke = r['anak_ke'],
            jarak = r['jarak'],
            haid = r['haid'],
            ket = r['ket'],
            bulan = r['bulan'],
            tahun = r['tahun']
        )
        db.session.add(w)
        db.session.commit()


class BersalinController:
    model = Bersalin()
    PER_PAGE = 50

    def read_for_page(self, bulan, tahun, page_num):
        _all = self.model.query.filter(Bersalin.tahun==tahun).filter(Bersalin.bulan==bulan).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).items
        ret = []
        for x in _all:
            r = dict(x.__dict__)
            r.pop('_sa_instance_state', None)
            try:
                r['suami'] = x.suami.nama
                r['ibu'] = x.ibu.nama
                r['rt'] = x.ibu.rt
                ret.append(r)
            except:
                print(x.id)
                pass

        has_next = self.model.query.filter(Bersalin.tahun==tahun).filter(Bersalin.bulan==bulan).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_next
        has_prev = self.model.query.filter(Bersalin.tahun==tahun).filter(Bersalin.bulan==bulan).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_prev
        return ret, has_prev, has_next

    def import_data(self, filename):
        file = os.path.join('sanansari/uploads', filename)
        df = pd.read_csv(file, header=0)
        try:
            for index, r in df.iterrows():
                w = Bersalin(
                    nik_suami = r['nik_suami'],
                    nik_ibu = r['nik_ibu'],
                    anak_ke = r['anak_ke'],
                    tgl_lahir = r['tgl_lahir'],
                    bb = r['bb'],
                    pb = r['pb'],
                    tindakan = r['tindakan'],
                    ket = r['ket'],
                    bulan = r['bulan'],
                    tahun = r['tahun']
                )
                db.session.add(w)

        except Exception as e:
            return {
                'status' : False,
                'message' : e
            }

        db.session.commit()
        return {
                'status' : True,
                'message' : 'Sukses'
            }
    
    def export_data(self):
        _all = self.model.query.all()
        ret = []
        for x in _all:
            r = dict(x.__dict__)
            r.pop('_sa_instance_state', None)
            try:
                r['suami'] = x.suami.nama
                r['ibu'] = x.ibu.nama
                r['rt'] = x.ibu.rt
                ret.append(r)
            except:
                print(x.id)
                pass
        
        now = datetime.now()
        dt = now.strftime("%d-%m-%Y_%H:%M:%S")
        _name = "bersalin_"+dt+".xlsx"

        df = pd.DataFrame.from_dict(ret)
        df.drop(['id'], axis=1, inplace=True)
        df.to_excel(os.path.join('sanansari/static/adm/export', _name), 
            sheet_name='sheet1', 
            index=False, 
            columns=[
                'nik_suami',
                'suami',
                'nik_ibu',
                'ibu', 
                'anak_ke', 
                'tgl_lahir', 
                'bb', 
                'pb',
                'tindakan',
                'ket', 
                'bulan', 
                'tahun'
            ]
        )
        return _name

    def read_tahun(self):
        _all = db.session.query(Bersalin.tahun).distinct().all()
        ret = [x[0] for x in _all]
        return ret

    def read_by_id(self, id):
        data = self.model.query.get(id)
        d = toDict(data)
        d['rt'] = data.suami.rt
        d['suami'] = data.suami.nama
        d['ibu'] = data.ibu.nama
        return d

    def delete(self, id):
        self.model.query.filter_by(id=id).delete()
        db.session.commit()

    def update(self, data):
        w = self.model.query.get(data['id'])
        for key, value in data.items():
            if hasattr(w, key):
                setattr(w, key, value)
        db.session.commit()

    def create(self, r):
        w = Bersalin(
            nik_suami = r['nik_suami'],
            nik_ibu = r['nik_ibu'],
            anak_ke = r['anak_ke'],
            tgl_lahir = r['tgl_lahir'],
            bb = r['bb'],
            pb = r['pb'],
            tindakan = r['tindakan'],
            ket = r['ket'],
            bulan = r['bulan'],
            tahun = r['tahun']
        )
        db.session.add(w)
        db.session.commit()


class AdminController:
    model = Admin()
    isLogin = False

    def login(self, user, pwd):
        dataUser = toDict(self.model.query.filter_by(user=user).first())
        encode_pwd = hashlib.md5(pwd.encode())
        pwd = encode_pwd.hexdigest()
        if dataUser:
            if pwd == dataUser['pwd']:
                session['user'] = dataUser['user']
                session['name'] = dataUser['name']
                session['id'] = dataUser['id']

                self.isLogin = True

                return {
                    'status': True
                }
            else:
                return {
                    'status': False,
                    'message': 'Password Invalid'
                }
        else:
            return {
                'status': False,
                'message': 'User Invalid'
            }

    def logout(self):
        session.clear()
        self.isLogin = False

    def change_pwd(self, data):
        ret = {}

        pwd_lama = data['pwd_lama']
        pwd_baru = data['pwd_baru']
        pwd_baru_conf = data['pwd_baru_conf']

        if len(pwd_lama) < 5:
            ret = {
                'status' : False,
                'message' : "Password baru harus lebih dari 5 karakter"
            }
        elif pwd_lama == pwd_baru:
            ret = {
                'status' : False,
                'message' : "Password baru harus berbeda dengan password lama"
            }
        elif pwd_baru_conf != pwd_baru:
            ret = {
                'status' : False,
                'message' : "Password baru harus sama dengan password konfirmasi"
            }
        elif self.isLogin == False:
            ret = {
                'status' : False,
                'message' : "Harap login untuk mengganti password"
            }
        else:
            dataUser = self.model.query.get(session['id'])
            encode_pwd = hashlib.md5(pwd_lama.encode())
            pwd_lama = encode_pwd.hexdigest()
            if dataUser.pwd != pwd_lama:
                ret = {
                    'status' : False,
                    'message' : "Password lama salah"
                }
            else:
                encode_pwd = hashlib.md5(pwd_baru.encode())
                pwd_baru = encode_pwd.hexdigest()
                dataUser.pwd = pwd_baru
                db.session.commit()
                ret = {
                    'status' : True,
                    'message' : "Password berhasil diganti"
                }

        return ret

    def create_post(self, data):
        category = Category()
        c = category.query.filter_by(name=data['category']).first()
        p = Post(
            title=data['title'],
            content=data['content'],
            admin_id=session['id'],
            category=c,
            img=data['img']
        )
        c.posts.append(p)
        db.session.add(c)
        db.session.commit()

    def create_category(self, name):
        c = Category(name=name)
        db.session.add(c)
        db.session.commit()


class CategoryController:
    model = Category()
    def read_all(self):
        _all = self.model.query.all()
        ret = [toDict(x) for x in _all]
        return ret

    def read_by_id(self, id):
        return toDict(self.model.query.get(id))

    def read_by_name(self, name):
        return toDict(self.model.query.filter_by(name=name).first())

    def update(self, data):
        c = self.model.query.get(data['id'])
        c.name = data['name']
        db.session.commit()

    def delete(self, id):
        self.model.query.filter_by(id=id).delete()
        db.session.commit()


class PostController:
    model = Post()
    PER_PAGE = 10

    def read_all(self):
        _all = self.model.query.join(Category).all()
        ret = [toDict(x) for x in _all]
        for i,r in enumerate(ret):
            ret[i]['category_name'] = _all[i].category.name
        return ret

    def read_for_highlight(self, num):
        _all = self.model.query.join(Category).order_by(db.desc(Post.date_posted)).limit(num).all()
        ret = [toDict(x) for x in _all]
        for i,r in enumerate(ret):
            ret[i]['category_name'] = _all[i].category.name
            ret[i]['date_posted'] = ret[i]['date_posted'].strftime("%d %B %Y, %H:%M")
        return ret

    def read_for_page(self, page_num):
        _all = self.model.query.join(Category).order_by(db.desc(Post.date_posted)).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).items
        has_next = self.model.query.paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_next
        has_prev = self.model.query.paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_prev
        ret = [toDict(x) for x in _all]
        for i,r in enumerate(ret):
            ret[i]['category_name'] = _all[i].category.name
            ret[i]['date_posted'] = ret[i]['date_posted'].strftime("%d %B %Y, %H:%M")
        return ret, has_prev, has_next

    def read_by_category(self, category_id, page_num):
        _all = self.model.query.join(Category).filter(Post.category_id==category_id).order_by(db.desc(Post.date_posted)).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).items
        has_next = self.model.query.filter(Post.category_id==category_id).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_next
        has_prev = self.model.query.filter(Post.category_id==category_id).paginate(per_page=self.PER_PAGE, page=int(page_num), error_out=False).has_prev
        ret = [toDict(x) for x in _all]
        for i,r in enumerate(ret):
            ret[i]['category_name'] = _all[i].category.name
            ret[i]['date_posted'] = ret[i]['date_posted'].strftime("%d %B %Y, %H:%M")
        return ret, has_prev, has_next

    def read_by_id(self, id):
        r = self.model.query.join(Category).filter(Post.id==id).first()
        if r is None:
            return []
        ret = toDict(r)
        ret['category_name'] = r.category.name
        ret['date_posted'] = ret['date_posted'].strftime("%d %B %Y, %H:%M")
        if ret['img'] == 'default':
            ret['img'] = 'static/images/cover_posts'
        else:
            ret['img'] = 'static/images/cover_images/'+ret['img']
        return ret

    def read_by_title(self, title):
        search = "%{}%".format(title)
        _all = self.model.query.join(Category).filter(Post.title.like(search)).all()
        ret = [toDict(x) for x in _all]
        for i,r in enumerate(ret):
            ret[i]['category_name'] = _all[i].category.name
        return ret

    def delete_post(self, id):
        self.model.query.filter_by(id=id).delete()
        db.session.commit()

    def update_post(self, data):
        category = Category()
        c = category.query.filter_by(name=data['category']).first()
        w = self.model.query.get(data['id'])
        w.content = data['content']
        w.title = data['title']
        w.category = c
        db.session.commit()


class CommentController:

    model = Comment()

    def read_by_post_id(self, post_id):
        _all = self.model.query.filter(Comment.post_id==post_id).all()
        ret = []
        for x in _all:
            tmp = toDict(x)
            tmp['date_posted'] = tmp['date_posted'].strftime("%d %B %Y, %H:%M")
            ret.append(tmp)
        return ret

    def create(self, data):
        w = Comment(
            post_id = data['post_id'],
            name = data['name'],
            text = data['text']
        )
        db.session.add(w)
        db.session.commit()


class ProfileController:
    model = {}

    def __init__(self):
        self._set()

    def _set(self):
        with open('sanansari/static/profile.json', 'r') as f:
            self.model = json.load(f)

    def _save(self):
        with open('sanansari/static/profile.json', 'w') as f:
            json.dump(self.model, f)

    def get(self):
        self._set()
        return self.model

    def update(self, data):
        self._set()
        self.model['profil'] = data['profil']
        self.model['sejarah'] = data['sejarah']
        self.model['profil_kb'] = data['profil_kb']
        self.model['struktur_kb'] = data['struktur_kb']
        self._save()


class JenisController:
    model = Jenis()

    def read_all(self):
        _all = self.model.query.all()
        ret = [toDict(x) for x in _all]
        return ret

    def update(self, data):
        c = self.model.query.get(data['id'])
        c.nama = data['nama']
        db.session.commit()

    def delete(self, id):
        self.model.query.filter_by(id=id).delete()
        db.session.commit()

    def create(self, data):
        c = Jenis(nama = data['nama'])
        db.session.add(c)
        db.session.commit()


class ProdukController:
    model = Produk()

    def read_all(self):
        _all = self.model.query.all()
        ret = []
        for x in _all:
            tmp = toDict(x)
            tmp['jenis'] = x.jenis.nama
            ret.append(tmp)
        return ret

    def read_by_id(self, id):
        data = self.model.query.get(id)
        ret = toDict(data)
        ret['jenis'] = data.jenis.nama
        return ret

    def read_by_jenis(self, jenis_id):
        _all = self.model.query.filter(Produk.jenis_id == jenis_id).all()
        ret = []
        for x in _all:
            tmp = toDict(x)
            tmp['jenis'] = x.jenis.nama
            ret.append(tmp)
        return ret

    def read_by_nama(self, nama):
        search = "%{}%".format(nama)
        _all = self.model.query.filter(Produk.nama.like(search)).all()
        ret = []
        for x in _all:
            tmp = toDict(x)
            tmp['jenis'] = x.jenis.nama
            ret.append(tmp)
        return ret

    def create(self, data):
        c = Produk(
            jenis_id = data['jenis_id'],
            nama = data['nama'],
            harga = data['harga'],
            ket = data['ket'],
            img = data['img']
        )
        db.session.add(c)
        db.session.commit()

    def delete(self, id):
        self.model.query.filter_by(id=id).delete()
        db.session.commit()

    def update(self, data):
        w = self.model.query.get(data['id'])
        for key, value in data.items():
            if hasattr(w, key):
                setattr(w, key, value)
        db.session.commit()


class Statistik:
    usia = UsiaController()
    warga = WargaController()
    p = PUSController()

    def jumlah_penduduk(self, rt):
        warga_all = self.usia.read_all()
        df_warga = pd.DataFrame.from_dict(warga_all)
        
        if rt == 'SEMUA':
            rentang = df_warga['rentang'].value_counts().to_dict()
        else:
            rt = int(rt)
            rentang = df_warga.loc[df_warga['rt'] == rt]['rentang'].value_counts().to_dict()
        ret = [[key, value] for key, value in rentang.items()]
        return ret
    
    def jumlah_penduduk_per_rt(self):
        warga_all = self.warga.read_all()
        df_warga = pd.DataFrame.from_dict(warga_all)
        rt = df_warga['rt'].value_counts().to_dict()
        ret = [["RT "+str(key), value] for key, value in rt.items()]
        return ret

    def kelamin_rentang_usia(self, rt):
        warga_all = self.usia.read_all()
        df_warga = pd.DataFrame.from_dict(warga_all)

        if rt == 'SEMUA':
            L = df_warga.loc[df_warga['jenis_kelamin'] == 'LAKI-LAKI']['rentang'].value_counts()
            P = df_warga.loc[df_warga['jenis_kelamin'] == 'PEREMPUAN']['rentang'].value_counts()
        else:
            rt = int(rt)
            L = df_warga.loc[df_warga['jenis_kelamin'] == 'LAKI-LAKI']
            L = L.loc[L['rt'] == rt]['rentang'].value_counts().to_dict()
            P = df_warga.loc[df_warga['jenis_kelamin'] == 'PEREMPUAN']
            P = P.loc[P['rt'] == rt]['rentang'].value_counts().to_dict()
        ret = [['Rentang Umur', 'Laki-laki', 'Perempuan']]
        for key in L.keys() & P.keys():
            ret.append([str(key), int(L[key]), int(P[key])])
        return ret
    
    def pendidikan(self, rt):
        warga_all = self.warga.read_all()
        df_warga = pd.DataFrame.from_dict(warga_all)
        
        if rt == 'SEMUA':
            pen = df_warga['pendidikan'].value_counts().to_dict()
        else:
            rt = int(rt)
            pen = df_warga.loc[df_warga['rt'] == rt]['pendidikan'].value_counts().to_dict()
        ret = [[key, value] for key, value in pen.items()]
        return ret
    
    def status(self, rt):
        warga_all = self.warga.read_all()
        df_warga = pd.DataFrame.from_dict(warga_all)
        
        if rt == 'SEMUA':
            pen = df_warga['status_kawin'].value_counts().to_dict()
        else:
            rt = int(rt)
            pen = df_warga.loc[df_warga['rt'] == rt]['status_kawin'].value_counts().to_dict()
        ret = [[key, value] for key, value in pen.items()]
        return ret
    
    def pekerjaan(self, rt):
        warga_all = self.warga.read_all()
        df_warga = pd.DataFrame.from_dict(warga_all)
        
        if rt == 'SEMUA':
            pen = df_warga['pekerjaan'].value_counts().to_dict()
        else:
            rt = int(rt)
            pen = df_warga.loc[df_warga['rt'] == rt]['pekerjaan'].value_counts().to_dict()  
        ret = [[key, value] for key, value in pen.items()]
        return ret

    def pus(self, bulan, tahun):
        d = self.p.read_all(tahun)
        df = pd.DataFrame.from_dict(d)

        '''
        <option value="S">SUNTIK</option>
                                    <option value="IAS">INGIN ANAK SEGERA (IAS)</option>
                                    <option value="IUD">INTRAUTERINE DEVICE (IUD-SPIRAL)</option>
                                    <option value="P">PIL (P)</option>
                                    <option value="IP">IMPLAN (IP)</option>
                                    <option value="Co">KONDOM (Co)</option>
                                    <option value="MOW">STERIL WANITA (MOW)</option>
                                    <option value="MOP">STERIL PRIA (MOP)</option>
                                    <option value="TIAL">TIDAK INGIN ANAK LAGI (TIAL)</option>
                                    <option value="IAT">INGIN ANAK TAPI DITUNDA (IAT)</option>
        '''

        ret = [['Bulan', 'IAS', 'IUD', 'PIL', 'IMPLAN', 'KONDOM', 'MOW', 'MOP', 'TIAL', 'IAT']]

        label_ = {
            'jan' : 'Januari',
            'feb' : 'Februari',
            'mar' : 'Maret',
            'apr' : 'April',
            'mei' : 'Mei',
            'jun' : 'Juni',
            'jul' : 'Juli',
            'ags' : 'Agustus',
            'sep' : 'September',
            'okt' : 'Oktober',
            'nov' : 'November',
            'des' : 'Desember'
        }

        label = dict(itertools.islice(label_.items(), bulan))

        for key, value in label.items():
            tmp = [
                value,
                int(df.loc[df[key] == 'IAS'][key].count()),
                int(df.loc[df[key] == 'IUD'][key].count()),
                int(df.loc[df[key] == 'P'][key].count()),
                int(df.loc[df[key] == 'IP'][key].count()),
                int(df.loc[df[key] == 'Co'][key].count()),
                int(df.loc[df[key] == 'MOW'][key].count()),
                int(df.loc[df[key] == 'MOP'][key].count()),
                int(df.loc[df[key] == 'TIAL'][key].count()),
                int(df.loc[df[key] == 'IAT'][key].count())
            ]
            ret.append(tmp)
        
        return ret


            
