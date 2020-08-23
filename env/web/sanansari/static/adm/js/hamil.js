function getDataHamil(search, bulan, tahun, page=1){
    ret = [];
    if(search == "all"){
        url = '/api/hamil/tahun/'+tahun+'/bulan/'+bulan+'/page/'+page;
    }else{
        url = '/api/hamil/nama/'+search;
    }
    $.ajax({
        url: url,
        dataType: 'json',
        method: 'get',
        async: false,
        success: function(data){
            ret = data;
        }
    });
    return ret;
}

function dataSelectSuamiHamil(){
    $.ajax({
        url: '/api/warga/suami',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#tambah-hamil-suami').append($('<option>', {
                    value: data[i]['nik'],
                    text: data[i]['nama'] + ' - ' + data[i]['nik'] + ' - RT' + data[i]['rt']
                }));
            }
        }
    });
}

function dataSelectIbuHamil(){
    $.ajax({
        url: '/api/warga/isteri',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#tambah-hamil-ibu').append($('<option>', {
                    value: data[i]['nik'],
                    text: data[i]['nama'] + ' - ' + data[i]['nik'] + ' - RT' + data[i]['rt']
                }));
            }
        }
    });
}

function dataSelectTahunHamil(){
    $.ajax({
        url: '/api/hamil/tahun',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#feature-hamil-tahun').append($('<option>', {
                    value: data[i],
                    text: data[i]
                }));
            }
        }
    });
}

function HamilFeature(){
    $('#card-header').show();
    html = 
    '<div class="d-flex"> \
        <div class="mr-auto p-2"> \
            <div class="input-group"> \
                <select class="form-control border" id="feature-hamil-bulan"> \
                    <option value="1">Januari</option> \
                    <option value="2">Februari</option> \
                    <option value="3">Maret</option> \
                    <option value="4">April</option> \
                    <option value="5">Mei</option> \
                    <option value="6">Juni</option> \
                    <option value="7">Juli</option> \
                    <option value="8">Agustus</option> \
                    <option value="9">September</option> \
                    <option value="10">Oktober</option> \
                    <option value="11">November</option> \
                    <option value="12">Desember</option> \
                </select> \
            </div> <br>\
            <div class="input-group"> \
                <select class="form-control border" id="feature-hamil-tahun"></select> \
            </div> \
        </div> \
        <div class="p-2"> \
            <button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#modal-tambah-hamil"> \
                <span class="fa fa-plus"></span> Tambah \
            </button> \
        </div> \
        <div class="p-2"> \
            <button type="button" class="btn btn-danger btn-sm" onclick="HamilDelete()"> \
                <span class="fa fa-trash"></span> Hapus \
            </button> \
        </div> \
    </div>';

    $('#content-feature').html(html);

    $('#feature-hamil-tahun').change(function () {
        y = $(this).val();
        m = $('#feature-hamil-bulan').val()
        HamilView(getDatahamil("all", m, y));
    });

    $('#feature-hamil-bulan').change(function () {
        m = $(this).val();
        y = $('#feature-hamil-tahun').val()
        HamilView(getDataHamil("all", m, y));
    });
}

function HamilView(ret){
    document.getElementById("content-title").innerHTML = "Data Ibu Hamil";
    $('#card-body').addClass('card-body');
    $('#card').addClass('card');

    data = ret['data']
    page = ret['page']
    next = ret['next']
    prev = ret['prev']

    html = "<table class='table' id='tbl-data-hamil'>";
    html += "<tr class='bg-primary text-light'>"
    html += "<th> </th>"
    html += '<th>No</th><th>Ibu Hamil</th><th>Suami</th><th>Anak ke-</th><th>Jarak</th><th>Haid Terakhir</th><th>Keterangan</th><th>RT</th></tr>';
    for(i=0; i<data.length; i++){
        html += '<tr class="clickable-row" id="row-'+ data[i]['id'] +'">';
        html += '<td><input type="checkbox" id="'+ data[i]['id'] +'"></td>'
        html += '<td><center><a id="'+ data[i]['id'] +'">'+ String(1+i+((page-1)*50)) +'</a></center></td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['ibu'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['suami'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['anak_ke'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['jarak'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['haid'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['ket'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['rt'] +'</td>';
        html += '</tr>';
    }
    html += "</table>";

    html += '\
    <nav aria-label="..."> \
    <ul class="pagination justify-content-center">'

    if (prev == false){
        html += '<li class="page-item disabled">'
        html += '<a class="page-link" href="#">Sebelumnya</a>'
    }else{
        html += '<li class="page-item">'
        html += '<a class="page-link" href="#" onclick="prevHamil('+page+')">Sebelumnya</a>'
    }
    
    html +=' \
        </li> \
        <li class="page-item active"> \
        <a class="page-link" href="#">';
    html += page+' <span class="sr-only">(current)</span></a> \
        </li> '
    if (next == false){
        html += '<li class="page-item disabled">'
        html += '<a class="page-link" href="#">Selanjutnya</a>'
    }else{
        html += '<li class="page-item" >'
        html += '<a class="page-link" href="#" onclick="nextHamil('+page+')" >Selanjutnya</a>'
    }
    html += '</li></ul></nav>';
    $('#content').html(html);

    $('#tbl-data-hamil td').click(function() {
        var id = $(this).find("a").attr("id");
        if(id !== undefined){
            HamilDetail(id);
        }
    });

    $('input[type="checkbox"]').click(function(){
        var id = $(this).attr("id");
        s = "#row-"+id
        if($(this).prop("checked") == true){
            $(s).css("background-color", "#ccc" );
        }
        else if($(this).prop("checked") == false){
            $(s).css("background-color", "#fff" );
        }
    });
}

function prevHamil(page){
    t = $('#feature-hamil-tahun').val();
    b = $('#feature-hamil-bulan').val();
    HamilView(getDataHamil("all", b, t, page-1));
}

function nextHamil(page){
    t = $('#feature-hamil-tahun').val();
    b = $('#feature-hamil-bulan').val();
    HamilView(getDataHamil("all", b, t, page+1));
}

function HamilDetail(id){ 
    data = [];
    $.ajax({
        url: '/api/hamil/'+id,
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            $('#detail-hamil-id').val(data['id']);
            $('#detail-hamil-bulan').val(data['bulan']);
            $('#detail-hamil-tahun').val(data['tahun']);
            $('#detail-hamil-suami').val(data['suami']);
            $('#detail-hamil-nik-suami').val(data['nik_suami']);
            $('#detail-hamil-ibu').val(data['ibu']);
            $('#detail-hamil-nik-ibu').val(data['nik_ibu']);
            $('#detail-hamil-anak-ke').val(data['anak_ke']);
            $('#detail-hamil-haid').val(data['haid']);
            $('#detail-hamil-jarak').val(data['jarak']);
            $('#detail-hamil-ket').val(data['ket']);
            $('#detail-hamil-rt').val(data['rt']);
            $('#modal-detail-hamil').modal('toggle');
        }
    });
}

function HamilEdit(){
    txt = "Anda akan merubah data ini. Lanjutkan ?"
    var r = confirm(txt);
    if(r == true) {
        data = {
            'id' : $('#detail-hamil-id').val(),
            'anak_ke' : $('#detail-hamil-anak-ke').val(),
            'jarak' : $('#detail-hamil-jarak').val(),
            'haid' : $('#detail-hamil-haid').val(),
            'ket' : $('#detail-hamil-ket').val()
        }
        
        url = '/api/hamil/'+$('#detail-hamil-id').val();

        $.ajax({
            method: 'put',
            contentType: "application/json; charset=utf-8",
            url: url,
            dataType: "json",
            data: JSON.stringify(data),
            success: function(res){
                toastr.success('Data berhasil diubah','Sukses');
                $('#modal-detail-hamil').modal('toggle');
                initHamil();
            }
        });

    }else{
        toastr.info('Data tidak diubah');
    }
}

function HamilAdd(){
    data = {
        'bulan' : $('#tambah-hamil-bulan').val(),
        'tahun' : $('#tambah-hamil-tahun').val(),
        'nik_suami' : $('#tambah-hamil-suami').val(),
        'nik_ibu' : $('#tambah-hamil-ibu').val(),
        'anak_ke' : $('#tambah-hamil-anak-ke').val(),
        'jarak' : $('#tambah-hamil-jarak').val(),
        'haid' : $('#tambah-hamil-haid').val(),
        'ket' : $('#tambah-hamil-ket').val()
    }

    $.ajax({
        method: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        url: '/api/hamil',
        success: function(res){
            if(res['status'] == 200){
                $('#tambah-hamil-bulan').val("");
                $('#tambah-hamil-tahun').val("");
                $('#tambah-hamil-suami').val("");
                $('#tambah-hamil-ibu').val("");
                $('#tambah-hamil-anak-ke').val("");
                $('#tambah-hamil-jarak').val("");
                $('#tambah-hamil-haid').val("");
                $('#tambah-hamil-ket').val("");
                toastr.success('Data behasil ditambahkan', 'Sukses');
                $('#modal-tambah-hamil').modal('toggle');
                initHamil();
            }
        },
    });
}

function HamilDelete(){
    all_check = $('input[type="checkbox"]');
    checked = []
    for(i=0;i<all_check.length;i++){
        if(all_check[i]["checked"] == true){
            checked.push($(all_check[i]).attr("id"));
        }
    }
    txt = "Anda akan menghapus "+checked.length+" data. Lanjutkan ?"
    var r = confirm(txt);
    if(r == true) {
        for(i=0;i<checked.length;i++){
            url = '/api/hamil/'+checked[i]
            $.ajax({
                method: 'delete',
                url: url,
                async: false,
                success: function(res){
                }
            });
        }
        toastr.success('Data berhasil dihapus','Sukses');
        initHamil();

    }else{
        toastr.info('Data tidak dihapus');
    }
}

