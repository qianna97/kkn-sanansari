$('#upload-berkas-warga').on('submit', function (event) {
    event.preventDefault();

    var files = $('#datas-input').get(0).files,
        formData = new FormData();

    if (files.length > 1) {
        alert('Upload maksimal 1 file');
        return false;
    }

    for (var i=0; i < files.length; i++) {
        var file = files[i];
        formData.append('datas[]', file, file.name);
    }

    uploadWarga(formData);
});

function uploadWarga(data){
    $.ajax({
        url: '/api/warga/data',
        method: 'post',
        data: data,
        processData: false,
        contentType: false,
        beforeSend: function() {
            $("#loading-upload-warga").show();
         },
        success: function(data) {
            if(data['status']){
                $('#modal-upload-warga').modal('toggle');
                toastr.success('Berkas berhasil diunggah pada database', 'Sukses');
            }else{
                toastr.error(data['message'], 'Galat');
            }
            $('#upload-berkas-warga').val("");
            $("#loading-upload-warga").hide();
        }
    });
}

function downloadWarga(){
    file = "";
    $.ajax({
        url: '/api/warga/data',
        method: 'get',
        async: false,
        success: function(data) {
            file = data['file']
        }
    });
    window.location.href = 'static/adm/export/'+file;
}


///////////////////////////////////////////////////////////////////


$('#upload-berkas-pus').on('submit', function (event) {
    event.preventDefault();

    var files = $('#datas-input-pus').get(0).files,
        formData = new FormData();

    if (files.length > 1) {
        alert('Upload maksimal 1 file');
        return false;
    }

    for (var i=0; i < files.length; i++) {
        var file = files[i];
        formData.append('datas[]', file, file.name);
    }

    uploadPUS(formData);
});

function uploadPUS(data){
    $.ajax({
        url: '/api/pus/data',
        method: 'post',
        data: data,
        processData: false,
        contentType: false,
        beforeSend: function() {
            $("#loading-upload-pus").show();
         },
        success: function(data) {
            if(data['status']){
                $('#modal-upload-pus').modal('toggle');
                toastr.success('Berkas berhasil diunggah pada database', 'Sukses');
            }else{
                toastr.error(data['message'], 'Galat');
            }
            $('#upload-berkas-pus').val("");
            $("#loading-upload-pus").hide();
        }
    });
}

function downloadPUS(){
    file = "";
    $.ajax({
        url: '/api/pus/data',
        method: 'get',
        async: false,
        success: function(data) {
            file = data['file']
        }
    });
    window.location.href = 'static/adm/export/'+file;
}


///////////////////////////////////////////////////////////////////


$('#upload-berkas-balita').on('submit', function (event) {
    event.preventDefault();

    var files = $('#datas-input-balita').get(0).files,
        formData = new FormData();

    if (files.length > 1) {
        alert('Upload maksimal 1 file');
        return false;
    }

    for (var i=0; i < files.length; i++) {
        var file = files[i];
        formData.append('datas[]', file, file.name);
    }

    uploadBalita(formData);
});

function uploadBalita(data){
    $.ajax({
        url: '/api/balita/data',
        method: 'post',
        data: data,
        processData: false,
        contentType: false,
        beforeSend: function() {
            $("#loading-upload-balita").show();
         },
        success: function(data) {
            if(data['status']){
                $('#modal-upload-balita').modal('toggle');
                toastr.success('Berkas berhasil diunggah pada database', 'Sukses');
            }else{
                toastr.error(data['message'], 'Galat');
            }
            $('#upload-berkas-balita').val("");
            $("#loading-upload-balita").hide();
        }
    });
}

function downloadBalita(){
    file = "";
    $.ajax({
        url: '/api/balita/data',
        method: 'get',
        async: false,
        success: function(data) {
            file = data['file']
        }
    });
    window.location.href = 'static/adm/export/'+file;
}

///////////////////////////////////////////////////////////////////


$('#upload-berkas-hamil').on('submit', function (event) {
    event.preventDefault();

    var files = $('#datas-input-hamil').get(0).files,
        formData = new FormData();

    if (files.length > 1) {
        alert('Upload maksimal 1 file');
        return false;
    }

    for (var i=0; i < files.length; i++) {
        var file = files[i];
        formData.append('datas[]', file, file.name);
    }

    uploadHamil(formData);
});

function uploadHamil(data){
    $.ajax({
        url: '/api/hamil/data',
        method: 'post',
        data: data,
        processData: false,
        contentType: false,
        beforeSend: function() {
            $("#loading-upload-hamil").show();
         },
        success: function(data) {
            if(data['status']){
                $('#modal-upload-hamil').modal('toggle');
                toastr.success('Berkas berhasil diunggah pada database', 'Sukses');
            }else{
                toastr.error(data['message'], 'Galat');
            }
            $('#upload-berkas-hamil').val("");
            $("#loading-upload-hamil").hide();
        }
    });
}

function downloadHamil(){
    file = "";
    $.ajax({
        url: '/api/hamil/data',
        method: 'get',
        async: false,
        success: function(data) {
            file = data['file']
        }
    });
    window.location.href = 'static/adm/export/'+file;
}

function downloadBersalin(){
    file = "";
    $.ajax({
        url: '/api/bersalin/data',
        method: 'get',
        async: false,
        success: function(data) {
            file = data['file']
        }
    });
    window.location.href = 'static/adm/export/'+file;
}


///////////////////////////////////////////////////////////////////


///////////////////////////////////////////////////////////////////


$('#upload-cover-image').on('submit', function (event) {
    event.preventDefault();

    var files = $('#datas-input-cover').get(0).files,
        formData = new FormData();

    if (files.length > 1) {
        alert('Upload maksimal 1 file');
        return false;
    }

    for (var i=0; i < files.length; i++) {
        var file = files[i];
        formData.append('datas[]', file, file.name);
        formData.append('type', $('#type').val());
    }

    $.ajax({
        url: '/upload/image',
        method: 'post',
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function() {
            $("#loading-upload-cover").show();
        },
        success: function(data) {
            if(data['status']){
                $('#modal-upload-cover').modal('toggle');
                toastr.success('Foto berhasil diunggah pada server', 'Sukses');
                initSetting();
            }else{
                toastr.error(data['message'], 'Galat');
            }
            $('#upload-berkas-cover').val("");
            $("#loading-upload-cover").hide();
        }
    });
});


///////////////////////////////////////////////////////////////////



function settingFeature(){
    $('#card-header').hide();
    $('#content-feature').html("");
}

function settingView(){
    $('#card-body').removeClass('card-body');
    $('#card').removeClass('card');

    $("#loading-upload-warga").hide();
    $("#loading-upload-pus").hide();
    $("#loading-upload-balita").hide();
    $("#loading-upload-hamil").hide();
    $("#loading-upload-bersalin").hide();
    $("#loading-upload-cover").hide();

    document.getElementById("content-title").innerHTML = "Pengaturan";
    html = '\
    <hr>\
    <h3>Halaman Utama</h3>\
    <div class="card-columns"> \
        <div class="card"> \
            <div class="card-body"> \
                <h5 class="card-title">Foto Sampul</h5> \
                <div>\
                    <img id="current-cover-posts" src="static/images/cover_home" alt="foto cover home" style="width:200px;height:100px;"/>\
                </div><br>\
                <a href="#" onclick="uploadCover(2)" class="card-link">Ganti Foto</a> \
            </div>\
        </div>\
        <div class="card"> \
            <div class="card-body"> \
                <h5 class="card-title">Foto Slide</h5> \
                <div>\
                    <select multiple class="form-group" id="list-slide"> \
                    </select> \
                </div>\
                <div>\
                    <img id="current-slide" style="width:200px;height:100px;"/>\
                </div><hr>\
                <a href="#" onclick="uploadCover(3)" class="card-link">Tambah</a> \
                <a href="#" class="card-link" onclick="deleteSlide()">Hapus</a> \
            </div>\
        </div>\
    </div>\
    <hr>\
    <h3>Artikel</h3>\
    <div class="card-columns"> \
        <div class="card"> \
            <div class="card-body"> \
                <h5 class="card-title">Kategori Artikel</h5> \
                <div>\
                    <select multiple class="form-group" id="list-category"> \
                    </select> \
                </div>\
                <a href="#" data-toggle="modal" data-target="#modal-add-category" class="card-link">Tambah</a> \
                <a href="#" onclick="detailCategory()" class="card-link">Ubah</a> \
                <a href="#" class="card-link" onclick="deleteCategory()">Hapus</a> \
            </div>\
        </div>\
        <div class="card"> \
            <div class="card-body"> \
                <h5 class="card-title">Foto Sampul</h5> \
                <div>\
                    <img id="current-cover-posts" src="static/images/cover_posts" alt="foto cover posts" style="width:200px;height:100px;"/>\
                </div><br>\
                <a href="#" onclick="uploadCover(1)" class="card-link">Ganti Foto</a> \
            </div>\
        </div>\
    </div>\
    <hr>\
    <h3>Data</h3>\
    <p>\
    Data yang diimpor akan masuk ke database dan data sebelumnya tidak akan terhapus oleh sistem.\
    Pastikan format Excel mengikut dengan yang telah disediakan pada menu "Unduh Format".\
    Pastikan pula data tidak memiliki duplikat NIK.\
    Data PUS, Balita, dan data lainnya selain Data Warga akan tertampil apabila NIK yang diinputkan sinkron dengan Data Warga. Sehingga pastikan NIK yang diinputkan sudah memiliki data di database Data Warga.\
    </p>\
    <div class="card-columns"> \
        <div class="card"> \
            <div class="card-body"> \
                <h5 class="card-title">Warga</h5> \
                <p class="card-text">Berisi data warga berupa identitas yang berasal dari Kartu Keluarga.</p> \
                <a href="static/adm/format/format_warga.csv" class="card-link">Unduh Format</a> \
                <a href="#" data-toggle="modal" data-target="#modal-upload-warga" class="card-link">Impor Data</a> \
                <a href="#" class="card-link" onclick="downloadWarga()">Ekspor Data</a> \
            </div>\
        </div>\
        <div class="card"> \
            <div class="card-body"> \
                <h5 class="card-title">PUS</h5> \
                <p class="card-text">Berisi data Pasangan Usia Subur dengan metode KB perbulan dan tahun.</p>\
                <a href="static/adm/format/format_pus.csv" class="card-link">Unduh Format</a> \
                <a href="#" class="card-link" data-toggle="modal" data-target="#modal-upload-pus">Impor Data</a> \
                <a href="#" class="card-link" onclick="downloadPUS()">Ekspor Data</a> \
            </div> \
        </div> \
        <div class="card"> \
            <div class="card-body"> \
                <h5 class="card-title">Balita</h5> \
                <p class="card-text">Berisi data Perkembangan Balita seperti berat badan dan sebagainya.</p>\
                <a href="static/adm/format/format_balita.csv" class="card-link">Unduh Format</a> \
                <a href="#" class="card-link" data-toggle="modal" data-target="#modal-upload-balita">Impor Data</a> \
                <a href="#" class="card-link" onclick="downloadBalita()">Ekspor Data</a> \
            </div> \
        </div> \
        <div class="card"> \
            <div class="card-body"> \
                <h5 class="card-title">Ibu Hamil</h5> \
                <p class="card-text">Berisi data Ibu Hamil seperti jarak kelahiran dan haid terakhir yang direkap perbulan dan tahun.</p>\
                <a href="static/adm/format/format_hamil.csv" class="card-link">Unduh Format</a> \
                <a href="#" class="card-link" data-toggle="modal" data-target="#modal-upload-hamil">Impor Data</a> \
                <a href="#" class="card-link" onclick="downloadHamil()">Ekspor Data</a> \
            </div> \
        </div> \
        <div class="card"> \
            <div class="card-body"> \
                <h5 class="card-title">Ibu Bersalin</h5> \
                <p class="card-text">Berisi data Ibu Bersalin seperti tanggal kelahiran yang disusun perbulan dan tahun.</p>\
                <a href="static/adm/format/format_bersalin.csv" class="card-link">Unduh Format</a> \
                <a href="#" class="card-link" data-toggle="modal" data-target="#modal-upload-bersalin">Impor Data</a> \
                <a href="#" class="card-link" onclick="downloadBersalin()">Ekspor Data</a> \
            </div> \
        </div> \
    </div>\
    <hr>\
    <h3>Akun</h3>\
    <div class="card-columns"> \
        <div class="card"> \
            <div class="card-body"> \
                <h5 class="card-title">Ganti Password</h5> \
                <table class="table table-borderless"> \
                    <tr> \
                        <td>Password Lama</td> \
                        <td><input type="password" class="form-control border" id="pwd-lama"></td> \
                    </tr> \
                    <tr> \
                        <td>Password Baru</td> \
                        <td><input type="password" class="form-control border" id="pwd-baru"></td> \
                    </tr> \
                    <tr> \
                        <td>Password Baru (ulangi)</td> \
                        <td><input type="password" class="form-control border" id="pwd-baru-ulangi"></td> \
                    </tr> \
                    <tr> \
                        <td> \
                            <button type="button" class="btn btn-primary btn-sm" onclick="changePassword()"> \
                            <span class="fa fa-check"></span> Konfirmasi \
                            </button> \
                        </td> \
                    <td> </td> \
                    </tr> \
                </table> \
            </div>\
        </div>\
        <div class="card"> \
            <div class="card-body"> \
                <h5 class="card-title">Sosial Media</h5> \
                <table class="table table-borderless"> \
                    <tr> \
                        <td>Telpon</td> \
                        <td><input type="text" class="form-control border" id="telp"></td> \
                    </tr> \
                    <tr> \
                        <td>Instagram</td> \
                        <td><input type="text" class="form-control border" id="ig"></td> \
                    </tr> \
                    <tr> \
                        <td> \
                            <button type="button" class="btn btn-primary btn-sm" onclick="changeSosmed()"> \
                            <span class="fa fa-check"></span> Konfirmasi \
                            </button> \
                        </td> \
                    <td> </td> \
                    </tr> \
                </table> \
            </div>\
        </div>\
    </div> \
    <hr>\
    <h3>Produk</h3>\
    <div class="card-columns"> \
        <div class="card"> \
            <div class="card-body"> \
                <h5 class="card-title">Jenis Produk</h5> \
                <div>\
                    <select multiple class="form-group" id="list-jenis"> \
                    </select> \
                </div>\
                <a href="#" data-toggle="modal" data-target="#modal-add-jenis" class="card-link">Tambah</a> \
                <a href="#" onclick="detailJenis()" class="card-link">Ubah</a> \
                <a href="#" class="card-link" onclick="deleteJenis()">Hapus</a> \
            </div>\
        </div>\
    </div>';

    $('#content').html(html);

    $.ajax({
        url: '/admin/category',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#list-category').append($('<option>', {
                    value: data[i]['id'],
                    text: data[i]['name']
                }));
            }
        }
    });

    $.ajax({
        url: '/api/jenis',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#list-jenis').append($('<option>', {
                    value: data[i]['id'],
                    text: data[i]['nama']
                }));
            }
        }
    });

    $.ajax({
        url: '/img/slide',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret['images'];
            for(i=0;i<data.length;i++){
                $('#list-slide').append($('<option>', {
                    value: data[i],
                    text: data[i]
                }));
            }
        }
    });

    $.ajax({
        url: '/api/telp',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret['telp'];
            data2 = ret['ig'];
            $('#telp').val(data)
            $('#ig').val(data2)
        }
    });

    $('#list-slide').change(function(){
        i = $(this).val();
        src = "static/images/"+i;
        $('#current-slide').attr('src', src);
    });
}

function changeSosmed(){
    ig_ = $('#ig').val();
    telp_ = $('#telp').val();

    $.ajax({
        method: 'put',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({'ig':ig_,'telp':telp_}),
        url: '/api/telp',
        success: function(res){
            if(res['status']){
                initSetting();
                toastr.success('Sosial media berhasil diganti', 'Sukses');
            }else{
                toastr.error(res['message'], 'Galat');
            }
        },
    });
}

function uploadCover(_type){
    if(_type == 1){ _type = "posts";}
    else if(_type == 2){ _type = "home";}
    else if(_type == 3){ _type = "slide";}

    $('#type').val(_type);
    $('#modal-upload-cover').modal('toggle');
}

function changePassword(){
    pwd_lama = $('#pwd-lama').val();
    pwd_baru = $('#pwd-baru').val();
    pwd_baru_conf = $('#pwd-baru-ulangi').val();
    data = {
        'pwd_lama':pwd_lama,
        'pwd_baru':pwd_baru,
        'pwd_baru_conf':pwd_baru_conf
    }
    $.ajax({
        method: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        url: '/admin/setting/password',
        success: function(res){
            if(res['status']){
                $('#pwd-lama').val("");
                $('#pwd-baru').val("");
                $('#pwd-baru-ulangi').val("");
                toastr.success('Password berhasil diganti', 'Sukses');
            }else{
                toastr.error(res['message'], 'Galat');
            }
        },
    });
}


function addCategory(){
    name = $('#category-name').val();
    data = {
        'name' : name
    }
    $.ajax({
        method: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        url: '/admin/category',
        success: function(res){
            if(res['status']){
                toastr.success(res['message'],'Sukses');
                $('#modal-add-category').modal('toggle');
                initSetting();
            }else{
                toastr.error(res['message'], 'Galat');
            }
        },
    });
}

function detailCategory(){
    id = $('#list-category').val();
    name = $('#list-category option:selected').html();
    $('#edit-category-id').val(id);
    $('#edit-category-name').val(name);
    $('#modal-edit-category').modal('toggle');
}

function deleteCategory(){
    id = $('#list-category').val();

    $.ajax({
        method: 'delete',
        url: '/admin/category/'+id,
        success: function(res){
            if(res['status']){
                toastr.success(res['message'],'Sukses');
                initSetting();
            }else{
                toastr.error(res['message'], 'Galat');
            }
        },
    });
}

function addJenis(){
    name = $('#jenis-name').val();
    data = {
        'nama' : name
    }
    $.ajax({
        method: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        url: '/api/jenis',
        success: function(res){
            if(res['status']){
                toastr.success(res['message'],'Sukses');
                $('#modal-add-jenis').modal('toggle');
                initSetting();
            }else{
                toastr.error(res['message'], 'Galat');
            }
        },
    });
}

function detailJenis(){
    id = $('#list-jenis').val();
    name = $('#list-jenis option:selected').html();
    $('#edit-jenis-id').val(id);
    $('#edit-jenis-name').val(name);
    $('#modal-edit-jenis').modal('toggle');
}

function deleteJenis(){
    id = $('#list-jenis').val();

    $.ajax({
        method: 'delete',
        url: '/api/jenis/'+id,
        success: function(res){
            if(res['status']){
                toastr.success(res['message'],'Sukses');
                initSetting();
            }else{
                toastr.error(res['message'], 'Galat');
            }
        },
    });
}

function deleteSlide(){
    img = $('#list-slide').val();

    $.ajax({
        method: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({'img':img}),
        url: '/img/slide',
        success: function(res){
            if(res['status']){
                toastr.error("Foto Slide Berhasil Dihapus", 'Galat');
                initSetting();
            }else{
                toastr.error(res['message'], 'Galat');
            }
        },
    });
}

function editCategory(){
    id = $('#edit-category-id').val();
    name = $('#edit-category-name').val();

    $.ajax({
        method: 'put',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({'id':id, 'name':name}),
        url: '/admin/category/'+id,
        success: function(res){
            if(res['status']){
                toastr.success(res['message'],'Sukses');
                $('#modal-edit-category').modal('toggle');
                initSetting();
            }else{
                toastr.error(res['message'], 'Galat');
            }
        },
    });
}

function editJenis(){
    id = $('#edit-jenis-id').val();
    nama = $('#edit-jenis-name').val();

    $.ajax({
        method: 'put',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify({'id':id, 'nama':nama}),
        url: '/api/jenis/'+id,
        success: function(res){
            if(res['status']){
                toastr.success(res['message'],'Sukses');
                $('#modal-edit-jenis').modal('toggle');
                initSetting();
            }else{
                toastr.error(res['message'], 'Galat');
            }
        },
    });
}
