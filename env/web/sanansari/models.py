from sanansari import db
from datetime import datetime
import json


'''
warga udah semua
pus kurang rt 4 5 6 7
balita kurang rt 4 5 6 7
hamil kurang rt 6
bersalin kurang rt 6
'''

class Warga(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nik = db.Column(db.String(20), unique=True, nullable=False)
    no_kk = db.Column(db.String(20), unique=False, nullable=False)
    nama = db.Column(db.String(120), unique=False, nullable=False)
    jenis_kelamin = db.Column(db.String(10), unique=False, nullable=False)
    tgl_lahir = db.Column(db.String(10), unique=False, nullable=False)
    hubungan_kk = db.Column(db.String(10), unique=False, nullable=True)
    agama = db.Column(db.String(10), unique=False, nullable=True)
    pendidikan = db.Column(db.String(20), unique=False, nullable=True)
    pekerjaan = db.Column(db.String(20), unique=False, nullable=True)
    status_kawin = db.Column(db.String(20), unique=False, nullable=True)
    rt = db.Column(db.Integer, unique=False, nullable=True)

    def __repr__(self):
        return f"Warga('{self.no_kk}', '{self.nik}', '{self.nama}')"


class PUS(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nik_suami = db.Column(db.String(20), db.ForeignKey('warga.nik'), nullable=False)
    nik_isteri = db.Column(db.String(20), db.ForeignKey('warga.nik'), nullable=False)
    jumlah_anak_hidup = db.Column(db.Integer, nullable=False)
    pengukuran_lila = db.Column(db.String(50), nullable=False)
    jan = db.Column(db.String(10), nullable=True)
    feb = db.Column(db.String(10), nullable=True)
    mar = db.Column(db.String(10), nullable=True)
    apr = db.Column(db.String(10), nullable=True)
    mei = db.Column(db.String(10), nullable=True)
    jun = db.Column(db.String(10), nullable=True)
    jul = db.Column(db.String(10), nullable=True)
    ags = db.Column(db.String(10), nullable=True)
    sep = db.Column(db.String(10), nullable=True)
    okt = db.Column(db.String(10), nullable=True)
    nov = db.Column(db.String(10), nullable=True)
    des = db.Column(db.String(10), nullable=True)
    tahun = db.Column(db.String(4), nullable=False)
    ket = db.Column(db.String(20), nullable=True)

    suami = db.relationship("Warga", backref="suami", uselist=False, foreign_keys=[nik_suami], lazy=True)
    isteri = db.relationship("Warga", backref="isteri", uselist=False, foreign_keys=[nik_isteri], lazy=True)

    def __repr__(self):
        return f"PUS('{self.nik_suami}', '{self.nik_isteri}')"


class Balita(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nik_anak = db.Column(db.String(20), db.ForeignKey('warga.nik'), nullable=False)
    nik_ibu = db.Column(db.String(20), db.ForeignKey('warga.nik'), nullable=False)
    anak_ke = db.Column(db.Integer, nullable=True)
    bb = db.Column(db.Float, nullable=True)
    tb = db.Column(db.Float, nullable=True)
    asi = db.Column(db.String(5), nullable=True)
    vit_a = db.Column(db.String(5), nullable=True)
    bulan = db.Column(db.Integer, nullable=False)
    tahun = db.Column(db.Integer, nullable=False)

    anak = db.relationship("Warga", backref="anak", uselist=False, foreign_keys=[nik_anak], lazy=True)
    ibu = db.relationship("Warga", backref="ibu", uselist=False, foreign_keys=[nik_ibu], lazy=True)

    def __repr__(self):
        return f"Balita('{self.nik_anak}', '{self.nik_ibu}')"


class Hamil(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nik_ibu = db.Column(db.String(20), db.ForeignKey('warga.nik'), nullable=False)
    nik_suami = db.Column(db.String(20), db.ForeignKey('warga.nik'), nullable=False)
    anak_ke = db.Column(db.Integer, nullable=True)
    jarak = db.Column(db.String(20), nullable=True)
    haid = db.Column(db.String(20), nullable=True)
    ket = db.Column(db.String(20), nullable=True)
    bulan = db.Column(db.Integer, nullable=False)
    tahun = db.Column(db.Integer, nullable=False)

    ibu = db.relationship("Warga", backref="ibu_hamil", uselist=False, foreign_keys=[nik_ibu], lazy=True)
    suami = db.relationship("Warga", backref="suami_hamil", uselist=False, foreign_keys=[nik_suami], lazy=True)

    def __repr__(self):
        return f"Hamil('{self.nik_ibu}', '{self.nik_suami}')"

class Bersalin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nik_ibu = db.Column(db.String(20), db.ForeignKey('warga.nik'), nullable=False)
    nik_suami = db.Column(db.String(20), db.ForeignKey('warga.nik'), nullable=False)
    anak_ke = db.Column(db.Integer, nullable=False)
    tgl_lahir = db.Column(db.String(10), nullable=False)
    bb = db.Column(db.Float, nullable=True)
    pb = db.Column(db.Float, nullable=True)
    tindakan = db.Column(db.String(50), nullable=True)
    ket = db.Column(db.String(50), nullable=True)
    bulan = db.Column(db.Integer, nullable=False)
    tahun = db.Column(db.Integer, nullable=False)

    ibu = db.relationship("Warga", backref="ibu_bersalin", uselist=False, foreign_keys=[nik_ibu], lazy=True)
    suami = db.relationship("Warga", backref="suami_bersalin", uselist=False, foreign_keys=[nik_suami], lazy=True)

    def __repr__(self):
        return f"Bersalin('{self.nik_ibu}', '{self.nik_suami}')"


class Admin(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user = db.Column(db.String(20), unique=True, nullable=False)
    pwd = db.Column(db.String(40), unique=False, nullable=False)
    name = db.Column(db.String(20), unique=False, nullable=False)
    posts = db.relationship('Post', backref='author', lazy=True)

    def __repr__(self):
        return f"Admin('{self.name}', '{self.user}')"


class Post(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.now)
    content = db.Column(db.Text, nullable=False)
    admin_id = db.Column(db.Integer, db.ForeignKey('admin.id'), nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'),nullable=False)
    img = db.Column(db.String(100), nullable=False)

    category = db.relationship('Category',backref=db.backref('posts', lazy=True))

    def __repr__(self):
        return f"Post('{self.title}', '{self.date_posted}')"


class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), unique=True, nullable=False)

    def __repr__(self):
        return f"Category('{self.id}', '{self.name}')"


class Comment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    post_id = db.Column(db.Integer, db.ForeignKey('post.id'), nullable=False)
    name = db.Column(db.String(10), nullable=False)
    text = db.Column(db.Text, nullable=False)
    date_posted = db.Column(db.DateTime, nullable=False, default=datetime.now)

    post = db.relationship("Post", backref="comment", uselist=False, foreign_keys=[post_id], lazy=True)

    def __repr__(self):
        return f"Comment('{self.id}', '{self.name}')"


class Jenis(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    nama = db.Column(db.String(20), nullable=False)

    def __repr__(self):
        return f"Prdouct('{self.id}', '{self.nama}')"


class Produk(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jenis_id = db.Column(db.Integer, db.ForeignKey('jenis.id'), nullable=False)
    nama = db.Column(db.String(20), nullable=False)
    harga = db.Column(db.String(10), nullable=False)
    ket = db.Column(db.Text, nullable=False)
    img = db.Column(db.String(20), nullable=False)

    jenis = db.relationship("Jenis", backref="jenis", uselist=False, foreign_keys=[jenis_id], lazy=True)

    def __repr__(self):
        return f"Prdouct('{self.id}', '{self.nama}')"