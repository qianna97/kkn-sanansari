from flask import render_template, flash, request, redirect, url_for, session, jsonify, abort
from flask_share import Share
from sanansari import app
from sanansari.controllers import *
from werkzeug.utils import secure_filename
from functools import wraps
import json
import os
from  sanansari.chatbot import main



admin = AdminController()
post = PostController()
category = CategoryController()
warga = WargaController()
pus = PUSController()
usia = UsiaController()
balita = BalitaController()
hamil = HamilController()
bersalin = BersalinController()
comment = CommentController()
profile = ProfileController()
jenis = JenisController()
produk = ProdukController()
stat = Statistik()

ALLOWED_EXTENSIONS = {'xls', 'csv', 'xlsx'}
ALLOWED_IMG_EXTENSIONS = {'jpg', 'jpeg', 'png', 'gif'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def allowed_image(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_IMG_EXTENSIONS

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if admin.isLogin == False:
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html', title="Galat"), 404

def get_slide_img():
    with open('sanansari/static/images/slide.json', 'r') as f:
        data = json.load(f)
    return data

def save_slide_img(data):
    with open('sanansari/static/images/slide.json', 'w') as f:
        json.dump(data, f)

def remove_slide_img(img):
    data = get_slide_img()
    data['images'].remove(img[0])
    save_slide_img(data)

def insert_slide_img(img):
    data = get_slide_img()
    data['images'].append(img)
    save_slide_img(data)


app.register_error_handler(404, page_not_found)
share = Share(app)

'''
 URL PAGE
'''
@app.route('/')
def index():
    posts = post.read_for_highlight(3)
    slide = get_slide_img()
    _jenis = jenis.read_all()
    profiles = profile.get()

    produk_data = []

    for j in _jenis:
        tmp = produk.read_by_jenis(j['id'])
        prod = " "
        produk_data.append({
            'jenis' : j['nama'],
            'img' : tmp[0]['img'],
            'prod' : prod.join([x['nama'] for x in tmp])
        })

    return render_template(
        'home.html',
        title="Utama",
        posts=posts,
        produk=produk_data,
        profiles=profiles,
        slides=slide['images']
    )

@app.route('/profil')
def profil_page():
    profiles = profile.get()
    return render_template(
        'profil.html',
        title="Profil Dusun Sanansari",
        profiles=profiles
    )

@app.route('/statistik')
def statistik():
    profiles = profile.get()
    return render_template(
        'statistik.html',
        title="Statistik Dusun Sanansari",
        profiles=profiles
    )

@app.route('/potensi')
def potensi_page():
    data = []

    jenis_all = jenis.read_all()

    for j in jenis_all:
        tmp = produk.read_by_jenis(j['id'])
        data.append({
            'jenis' : j['nama'],
            'produk' : tmp
        })

    return render_template(
        'potensi.html',
        datas=data,
        title="Produk UMKM Sanansari"
    )

@app.route('/kampungkb')
def kb():
    profiles = profile.get()
    return render_template(
        'kampungkb.html',
        title="Kampung KB Sanansari",
        profiles=profiles
    )

@app.route('/chatbotkb')
def chatbot_page():
    return render_template(
        'chatbot.html',
        title="Pesan Interaktif Seputar KB"
    )

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'GET':
        if admin.isLogin:
            return redirect(url_for('adminPage'))
        else:
            return render_template(
                'login.html',
                title="Login",
                category="",
                date=""
            )
    if request.method == 'POST':
        user = request.form['loginUser']
        pwd = request.form['loginPwd']

        checkLogin = admin.login(user, pwd)

        if(checkLogin['status']):
            return redirect(url_for('adminPage'))
        else:
            flash(checkLogin['message'])
            return render_template(
                'login.html',
                title="Login",
                category="",
                date=""
            )

@app.route('/logout')
def logout():
    admin.logout()
    return redirect(url_for('login'))

@app.route('/admin')
@login_required
def adminPage():
    return render_template('admin.html')

@app.route('/chat')
def chat_page():
    return render_template('chat.html')

@app.route('/comment', methods=['POST'])
def create_comment():
    post_id = request.form['post_id']
    name = request.form['name']
    text = request.form['text']

    comment.create({'post_id':post_id, 'name':name, 'text':text})

    return redirect(url_for('get_post', id=post_id))

@app.route('/artikel', methods=['GET'])
def get_all_post():
    return redirect(url_for('get_post_for_page', page=1))

@app.route('/artikel/page/<page>', methods=['GET'])
def get_post_for_page(page):
    data, has_prev, has_next = post.read_for_page(page)
    if len(data) == 0:
        abort(404)
    return render_template(
        'posts.html',
        data=data,
        title="Artikel",
        category="",
        date="",
        page=page,
        has_prev=has_prev,
        has_next=has_next
    )

@app.route('/artikel/kategori/<category_id>', methods=['GET'])
def get_category(category_id):
    return redirect(url_for('get_category_for_page', page=1, category_id=category_id))

@app.route('/artikel/kategori/<category_id>/page/<page>', methods=['GET'])
def get_category_for_page(category_id, page):
    data, has_prev, has_next = post.read_by_category(category_id, page)
    if len(data) == 0:
        abort(404)
    return render_template(
        'posts.html',
        data=data,
        title=data[0]['category_name'],
        category="",
        category_id=category_id,
        date="",
        page=page,
        has_prev=has_prev,
        has_next=has_next
    )

@app.route('/artikel/<id>', methods=['GET'])
def get_post(id):
    data = post.read_by_id(id)
    comments = comment.read_by_post_id(id)
    if len(data) == 0:
        abort(404)
    return render_template(
        'post.html',
        content=data['content'],
        comments=comments,
        title=data['title'],
        id=data['id'],
        category=data['category_name'],
        date=data['date_posted'],
        share=share,
        img=data['img']
    )


'''
URL API
'''

# WARGA
@app.route('/api/warga', methods=["POST", "GET"])
@login_required
def warga_all():
    if request.method == 'GET':
        ret = warga.read_all()
        return jsonify(ret)
    elif request.method == 'POST':
        print(request.form)
        data = {
            'nama' : request.form['nama'],
            'nik' : request.form['nik'],
            'no_kk' : request.form['no_kk'],
            'hubungan_kk' : request.form['hubungan_kk'],
            'status_kawin' : request.form['status_kawin'],
            'jenis_kelamin' : request.form['jenis_kelamin'],
            'rt' : request.form['rt'],
            'tgl_lahir' : request.form['tgl_lahir'],
            'agama' : request.form['agama'],
            'pendidikan' : request.form['pendidikan'],
            'pekerjaan' : request.form['pekerjaan']
        }
        warga.create(data)
        return jsonify({'status':200})

@app.route('/api/warga/page/<page>', methods=["GET"])
@login_required
def warga_page(page):
    ret, has_prev, has_next = warga.read_for_page(page)
    data = {
        'data' : ret,
        'page' : page,
        'prev' : has_prev,
        'next' : has_next
    }
    return jsonify(data)

@app.route('/api/warga/<id>', methods=["GET", "DELETE", "PUT"])
@login_required
def warga_id(id):
    if request.method == 'GET':
        ret = warga.read_by_id(id)
        return jsonify(ret)
    elif request.method == 'DELETE':
        warga.delete(id)
        return jsonify({'status':200})
    elif request.method == 'PUT':
        data = request.json
        warga.update(data)
        return jsonify({'status':200})

@app.route('/api/warga/nama/<nama>', methods=["GET"])
@login_required
def warga_nama(nama):
    ret = warga.read_by_nama(nama)
    return jsonify({
        'data':ret,
        'page':1,
        'prev' : False,
        'next' : False
        })

@app.route('/api/warga/nik/<nik>', methods=["GET"])
@login_required
def warga_nik(nik):
    ret = warga.read_by_nik(nik)
    return jsonify(ret)

@app.route('/api/warga/data', methods=["GET", "POST"])
@login_required
def warga_data():
    if request.method == "POST":
        f = request.files['datas[]']
        if f and allowed_file(f.filename):
            f.save(os.path.join('sanansari/uploads', secure_filename(f.filename)))
            ret = warga.import_data(secure_filename(f.filename))
            return jsonify(ret)
        else:
            return jsonify({
                'status' : False,
                'message' : 'Tipe file tidak didukung'
            })
    if request.method == "GET":
        _name = warga.export_data()
        return jsonify({
            'status' : True,
            'file' : _name
        })

@app.route('/api/warga/suami', methods=["GET"])
@login_required
def warga_suami():
    ret = warga.read_all_suami()
    return jsonify(ret)

@app.route('/api/warga/isteri', methods=["GET"])
@login_required
def warga_isteri():
    ret = warga.read_all_isteri()
    return jsonify(ret)

@app.route('/api/warga/balita', methods=["GET"])
@login_required
def warga_balita():
    ret = warga.read_all_balita()
    return jsonify(ret)


# PUS
@app.route('/api/pus', methods=["POST", "GET"])
@login_required
def pus_all():
    if request.method == 'GET':
        ret = pus.read_all()
        return jsonify(ret)
    elif request.method == 'POST':
        r = request.json
        pus.create(r)
        return jsonify({'status':200})

@app.route('/api/pus/tahun', methods=["GET"])
@login_required
def pus_tahun():
    ret = pus.read_tahun()
    return jsonify(ret)

@app.route('/api/pus/tahun/<tahun>/page/<page>', methods=["GET"])
@login_required
def pus_page(tahun, page):
    ret, has_prev, has_next = pus.read_for_page(tahun, page)
    data = {
        'data' : ret,
        'page' : page,
        'prev' : has_prev,
        'next' : has_next
    }
    return jsonify(data)

@app.route('/api/pus/<id>', methods=["GET", "DELETE", "PUT"])
@login_required
def pus_id(id):
    if request.method == 'GET':
        ret = pus.read_by_id(id)
        return jsonify(ret)
    elif request.method == 'DELETE':
        pus.delete(id)
        return jsonify({'status':200})
    elif request.method == 'PUT':
        data = request.json
        pus.update(data)
        return jsonify({'status':200})

@app.route('/api/pus/nama/<nama>', methods=["GET"])
@login_required
def pus_nama(nama):
    ret = pus.read_by_nama(nama)
    return jsonify({
        'data':ret,
        'page':1,
        'prev' : False,
        'next' : False
        })

@app.route('/api/pus/nik/<nik>', methods=["GET"])
@login_required
def pus_nik(nik):
    ret = pus.read_by_nik(nik)
    return jsonify(ret)

@app.route('/api/pus/data', methods=["GET", "POST"])
@login_required
def pus_data():
    if request.method == "POST":
        f = request.files['datas[]']
        if f and allowed_file(f.filename):
            f.save(os.path.join('sanansari/uploads', secure_filename(f.filename)))
            ret = pus.import_data(secure_filename(f.filename))
            return jsonify(ret)
        else:
            return jsonify({
                'status' : False,
                'message' : 'Tipe file tidak didukung'
            })
    if request.method == "GET":
        _name = pus.export_data()
        return jsonify({
            'status' : True,
            'file' : _name
        })


# RENTANG USIA
@app.route('/api/usia/page/<page>', methods=["GET"])
@login_required
def usia_page(page):
    ret, has_prev, has_next = usia.read_for_page(page)
    data = {
        'data' : ret,
        'page' : page,
        'prev' : has_prev,
        'next' : has_next
    }
    return jsonify(data)

@app.route('/api/kb/data', methods=["GET", "POST"])
@login_required
def kb_data():
    if request.method == "POST":
        f = request.files['datas[]']
        if f and allowed_file(f.filename):
            f.save(os.path.join('uploads', secure_filename(f.filename)))
            ret = data_kb.import_data(secure_filename(f.filename))
            return jsonify(ret)
        else:
            return jsonify({
                'status' : False,
                'message' : 'Tipe file tidak didukung'
            })
    if request.method == "GET":
        _name = data_kb.export_data()
        return jsonify({
            'status' : True,
            'file' : _name
        })

@app.route('/api/usia/nama/<nama>', methods=["GET"])
@login_required
def usia_nama(nama):
    ret = usia.read_by_nama(nama)
    return jsonify({
        'data':ret,
        'page':1,
        'prev' : False,
        'next' : False
        })


# BALITA
@app.route('/api/balita', methods=["POST"])
@login_required
def balita_all():
    r = request.json
    balita.create(r)
    return jsonify({'status':200})

@app.route('/api/balita/data', methods=["GET", "POST"])
@login_required
def balita_data():
    if request.method == "POST":
        f = request.files['datas[]']
        if f and allowed_file(f.filename):
            f.save(os.path.join('sanansari/uploads', secure_filename(f.filename)))
            ret = balita.import_data(secure_filename(f.filename))
            return jsonify(ret)
        else:
            return jsonify({
                'status' : False,
                'message' : 'Tipe file tidak didukung'
            })
    if request.method == "GET":
        _name = balita.export_data()
        return jsonify({
            'status' : True,
            'file' : _name
        })

@app.route('/api/balita/tahun/<tahun>/bulan/<bulan>/page/<page>', methods=["GET"])
@login_required
def balita_page(bulan, tahun, page):
    ret, has_prev, has_next = balita.read_for_page(bulan, tahun, page)
    data = {
        'data' : ret,
        'page' : page,
        'prev' : has_prev,
        'next' : has_next
    }
    return jsonify(data)

@app.route('/api/balita/tahun', methods=["GET"])
@login_required
def balita_tahun():
    ret = balita.read_tahun()
    return jsonify(ret)

@app.route('/api/balita/<id>', methods=["GET", "DELETE", "PUT"])
@login_required
def balita_id(id):
    if request.method == 'GET':
        ret = balita.read_by_id(id)
        return jsonify(ret)
    elif request.method == 'DELETE':
        balita.delete(id)
        return jsonify({'status':200})
    elif request.method == 'PUT':
        data = request.json
        balita.update(data)
        return jsonify({'status':200})


# HAMIL
@app.route('/api/hamil', methods=["POST"])
@login_required
def hamil_all():
    r = request.json
    hamil.create(r)
    return jsonify({'status':200})

@app.route('/api/hamil/data', methods=["GET", "POST"])
@login_required
def hamil_data():
    if request.method == "POST":
        f = request.files['datas[]']
        if f and allowed_file(f.filename):
            f.save(os.path.join('sanansari/uploads', secure_filename(f.filename)))
            ret = hamil.import_data(secure_filename(f.filename))
            return jsonify(ret)
        else:
            return jsonify({
                'status' : False,
                'message' : 'Tipe file tidak didukung'
            })
    if request.method == "GET":
        _name = hamil.export_data()
        return jsonify({
            'status' : True,
            'file' : _name
        })

@app.route('/api/hamil/tahun/<tahun>/bulan/<bulan>/page/<page>', methods=["GET"])
@login_required
def hamil_page(bulan, tahun, page):
    ret, has_prev, has_next = hamil.read_for_page(bulan, tahun, page)
    data = {
        'data' : ret,
        'page' : page,
        'prev' : has_prev,
        'next' : has_next
    }
    return jsonify(data)

@app.route('/api/hamil/tahun', methods=["GET"])
@login_required
def hamil_tahun():
    ret = hamil.read_tahun()
    return jsonify(ret)

@app.route('/api/hamil/<id>', methods=["GET", "DELETE", "PUT"])
@login_required
def hamil_id(id):
    if request.method == 'GET':
        ret = hamil.read_by_id(id)
        return jsonify(ret)
    elif request.method == 'DELETE':
        hamil.delete(id)
        return jsonify({'status':200})
    elif request.method == 'PUT':
        data = request.json
        hamil.update(data)
        return jsonify({'status':200})


# BERSALIN
@app.route('/api/bersalin', methods=["POST"])
@login_required
def bersalin_all():
    r = request.json
    bersalin.create(r)
    return jsonify({'status':200})

@app.route('/api/bersalin/data', methods=["GET", "POST"])
@login_required
def bersalin_data():
    if request.method == "POST":
        f = request.files['datas[]']
        if f and allowed_file(f.filename):
            f.save(os.path.join('sanansari/uploads', secure_filename(f.filename)))
            ret = bersalin.import_data(secure_filename(f.filename))
            return jsonify(ret)
        else:
            return jsonify({
                'status' : False,
                'message' : 'Tipe file tidak didukung'
            })
    if request.method == "GET":
        _name = bersalin.export_data()
        return jsonify({
            'status' : True,
            'file' : _name
        })

@app.route('/api/bersalin/tahun/<tahun>/bulan/<bulan>/page/<page>', methods=["GET"])
@login_required
def bersalin_page(bulan, tahun, page):
    ret, has_prev, has_next = bersalin.read_for_page(bulan, tahun, page)
    data = {
        'data' : ret,
        'page' : page,
        'prev' : has_prev,
        'next' : has_next
    }
    return jsonify(data)

@app.route('/api/bersalin/tahun', methods=["GET"])
@login_required
def bersalin_tahun():
    ret = bersalin.read_tahun()
    return jsonify(ret)

@app.route('/api/bersalin/<id>', methods=["GET", "DELETE", "PUT"])
@login_required
def bersalin_id(id):
    if request.method == 'GET':
        ret = bersalin.read_by_id(id)
        return jsonify(ret)
    elif request.method == 'DELETE':
        bersalin.delete(id)
        return jsonify({'status':200})
    elif request.method == 'PUT':
        data = request.json
        bersalin.update(data)
        return jsonify({'status':200})


# ADMIN STUFF
@app.route('/admin/setting/password', methods=["POST"])
@login_required
def change_password():
    r = request.json
    ret = admin.change_pwd(r)
    return jsonify(ret)

@app.route('/admin/post', methods=['POST', 'GET'])
@login_required
def post_page():
    if request.method == 'POST':
        data = request.form.to_dict()
        try:
            f = request.files['img']
            if f and allowed_image(f.filename):
                f.save(os.path.join('sanansari/static/images/cover_images', secure_filename(f.filename)))
                data['img'] = secure_filename(f.filename)
        except Exception as e:
            data['img'] = "default"
        admin.create_post(data)
        return jsonify({'status' : True, 'message': 'Tulisan berhasil diterbitkan pada website'})
    elif request.method == 'GET':
        data = post.read_all()
        return jsonify(data)

@app.route('/admin/post/title/<title>', methods=['GET'])
@login_required
def category_search(title):
    data = post.read_by_title(title)
    return jsonify(data)

@app.route('/admin/post/<id>', methods=['PUT', 'GET', 'DELETE'])
@login_required
def post_id_page(id):
    if request.method == 'GET':
        data = post.read_by_id(id)
        return jsonify(data)
    elif request.method == 'DELETE':
        post.delete_post(id)
        return jsonify({'status':200})
    elif request.method == 'PUT':
        data = request.json
        post.update_post(data)
        return jsonify({'status':200})

@app.route('/admin/category', methods=['POST', 'GET'])
@login_required
def category_function():
    if request.method == 'POST':
        data = request.json['name']
        admin.create_category(data)
        return jsonify({'status' : True, 'message': 'Kategori berhasil ditambahkan'})
    elif request.method == 'GET':
        data = category.read_all()
        return jsonify(data)

@app.route('/admin/category/<id>', methods=['DELETE', 'PUT'])
@login_required
def category_item(id):
    if request.method == 'PUT':
        data = request.json
        category.update(data)
        return jsonify({'status' : True, 'message': 'Kategori berhasil diubah'})
    elif request.method == 'DELETE':
        category.delete(id)
        return jsonify({'status' : True, 'message': 'Kategori berhasil dihapus'})

@app.route('/api/chat', methods=["POST"])
def chatbot_api():
    result = main.chat(request.json['message'])
    ret = {
        'message' : result
    }
    return jsonify(ret)


@app.route('/upload/image', methods=["POST"])
@login_required
def upload_cover_image():
    f = request.files['datas[]']
    _type = request.form['type']

    if f and allowed_image(f.filename):
        if _type == 'posts':
            fn = "cover_posts"
        elif _type == 'home':
            fn = "cover_home"
        elif _type == 'slide':
            fn = secure_filename(f.filename)
            insert_slide_img(fn)
        f.save(os.path.join('sanansari/static/images', fn))
        return jsonify({
            'status' : True
        })
    else:
        return jsonify({
            'status' : False,
            'message' : 'Tipe file tidak didukung'
        })

@app.route('/img/slide', methods=["GET","POST"])
def slide_image():
    if request.method == 'GET':
        data = get_slide_img()
        return jsonify(data)
    elif request.method == 'POST':
        data = request.json
        remove_slide_img(data['img'])
        return jsonify({'status':True})

@app.route('/admin/profile', methods=["GET", "PUT"])
@login_required
def profile_api():
    if request.method == 'GET':
        return jsonify(profile.get())
    elif request.method == 'PUT':
        data = request.json
        profile.update(data)
        return jsonify({'status':True})


# PRODUK
@app.route('/api/produk', methods=["POST", "GET"])
@login_required
def produk_all():
    if request.method == 'GET':
        ret = produk.read_all()
        return jsonify(ret)
    elif request.method == 'POST':
        f = request.files['datas[]']
        data = {
            'nama' : request.form['nama'],
            'jenis_id' : request.form['jenis_id'],
            'harga' : request.form['harga'],
            'ket' : request.form['ket']
        }
        if f and allowed_image(f.filename):
            fn = secure_filename(f.filename)
            data['img'] = fn
            produk.create(data)
            f.save(os.path.join('sanansari/static/images/produk_images', fn))
            return jsonify({
                'status' : True
            })
        else:
            return jsonify({
                'status' : False,
                'message' : 'Tipe file tidak didukung'
            })
        return jsonify({'status':200})

@app.route('/api/produk/<id>', methods=["GET", "DELETE", "PUT"])
@login_required
def produk_id(id):
    if request.method == 'GET':
        ret = produk.read_by_id(id)
        return jsonify(ret)
    elif request.method == 'DELETE':
        produk.delete(id)
        return jsonify({'status':200})
    elif request.method == 'PUT':
        data = request.json
        produk.update(data)
        return jsonify({'status':200})

@app.route('/api/produk/nama/<nama>', methods=["GET"])
@login_required
def produk_nama(nama):
    ret = produk.read_by_nama(nama)
    return jsonify(ret)

@app.route('/api/jenis', methods=["POST", "GET"])
@login_required
def jenis_all():
    if request.method == 'GET':
        ret = jenis.read_all()
        return jsonify(ret)
    elif request.method == 'POST':
        print("masuk")
        data = request.json
        jenis.create(data)
        return jsonify({'status' : True, 'message': 'Kategori berhasil ditambahkan'})

@app.route('/api/jenis/<id>', methods=['DELETE', 'PUT'])
@login_required
def jenis_item(id):
    if request.method == 'PUT':
        data = request.json
        jenis.update(data)
        return jsonify({'status' : True, 'message': 'Kategori berhasil diubah'})
    elif request.method == 'DELETE':
        jenis.delete(id)
        return jsonify({'status' : True, 'message': 'Kategori berhasil dihapus'})


@app.route('/api/stat/jumlah_penduduk/<rt>', methods=['GET'])
def jml_pen(rt):
    return jsonify({'data': stat.jumlah_penduduk(rt)})

@app.route('/api/stat/jumlah_penduduk_per_rt', methods=['GET'])
def jml_pen_rt():
    return jsonify({'data': stat.jumlah_penduduk_per_rt()})

@app.route('/api/stat/kelamin_rentang_usia/<rt>', methods=['GET'])
def kel_usia(rt):
    return jsonify({'data': stat.kelamin_rentang_usia(rt)})

@app.route('/api/stat/pendidikan/<rt>', methods=['GET'])
def pend(rt):
    return jsonify({'data': stat.pendidikan(rt)})

@app.route('/api/stat/status/<rt>', methods=['GET'])
def sta(rt):
    return jsonify({'data': stat.status(rt)})

@app.route('/api/stat/pekerjaan/<rt>', methods=['GET'])
def pkr(rt):
    return jsonify({'data': stat.pekerjaan(rt)})

@app.route('/api/stat/pus/<tahun>/<bulan>', methods=['GET'])
def pus_viz(bulan, tahun):
    return jsonify({'data': stat.pus(int(bulan), tahun)})

@app.route('/api/rt', methods=['GET'])
@login_required
def rt_dist():
    return jsonify({'data': warga.get_rt()})

@app.route('/api/telp', methods=['GET','PUT'])
def telp():
    if request.method == 'GET':
        with open('sanansari/static/telp.json', 'r') as f:
            ret = json.load(f)
        return jsonify(ret)
    elif request.method == 'PUT':
        with open('sanansari/static/telp.json', 'r') as f:
            ret = json.load(f)
        ret['telp'] = request.json['telp']
        ret['ig'] = request.json['ig']
        with open('sanansari/static/telp.json', 'w') as f:
            json.dump(ret, f)
        return jsonify({'status': True})