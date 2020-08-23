function getDataBersalin(search, bulan, tahun, page=1){
    ret = [];
    if(search == "all"){
        url = '/api/bersalin/tahun/'+tahun+'/bulan/'+bulan+'/page/'+page;
    }else{
        url = '/api/bersalin/nama/'+search;
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

function dataSelectSuamiBersalin(){
    $.ajax({
        url: '/api/warga/suami',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#tambah-bersalin-suami').append($('<option>', {
                    value: data[i]['nik'],
                    text: data[i]['nama'] + ' - ' + data[i]['nik'] + ' - RT' + data[i]['rt']
                }));
            }
        }
    });
}

function dataSelectIbuBersalin(){
    $.ajax({
        url: '/api/warga/isteri',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#tambah-bersalin-ibu').append($('<option>', {
                    value: data[i]['nik'],
                    text: data[i]['nama'] + ' - ' + data[i]['nik'] + ' - RT' + data[i]['rt']
                }));
            }
        }
    });
}

function dataSelectTahunBersalin(){
    $.ajax({
        url: '/api/bersalin/tahun',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#feature-bersalin-tahun').append($('<option>', {
                    value: data[i],
                    text: data[i]
                }));
            }
        }
    });
}

function BersalinFeature(){
    $('#card-header').show();
    html = 
    '<div class="d-flex"> \
        <div class="mr-auto p-2"> \
            <div class="input-group"> \
                <select class="form-control border" id="feature-bersalin-bulan"> \
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
                <select class="form-control border" id="feature-bersalin-tahun"></select> \
            </div> \
        </div> \
        <div class="p-2"> \
            <button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#modal-tambah-bersalin"> \
                <span class="fa fa-plus"></span> Tambah \
            </button> \
        </div> \
        <div class="p-2"> \
            <button type="button" class="btn btn-danger btn-sm" onclick="BersalinDelete()"> \
                <span class="fa fa-trash"></span> Hapus \
            </button> \
        </div> \
    </div>';

    $('#content-feature').html(html);

    $('#feature-bersalin-tahun').change(function () {
        y = $(this).val();
        m = $('#feature-bersalin-bulan').val()
        BersalinView(getDatabersalin("all", m, y));
    });

    $('#feature-bersalin-bulan').change(function () {
        m = $(this).val();
        y = $('#feature-bersalin-tahun').val()
        BersalinView(getDataBersalin("all", m, y));
    });
}

function BersalinView(ret){
    document.getElementById("content-title").innerHTML = "Data Ibu Bersalin";
    $('#card-body').addClass('card-body');
    $('#card').addClass('card');

    data = ret['data']
    page = ret['page']
    next = ret['next']
    prev = ret['prev']

    html = "<table class='table' id='tbl-data-bersalin'>";
    html += "<tr class='bg-primary text-light'>"
    html += "<th> </th>"
    html += '<th>No</th><th>Ibu Bersalin</th><th>Suami</th><th>Anak ke-</th><th>Tanggal Lahir</th><th>Berat Badan (Kg)</th><th>Panjang Badan (cm)</th><th>Tindakan</th><th>Keterangan</th><th>RT</th></tr>';
    for(i=0; i<data.length; i++){
        html += '<tr class="clickable-row" id="row-'+ data[i]['id'] +'">';
        html += '<td><input type="checkbox" id="'+ data[i]['id'] +'"></td>'
        html += '<td><center><a id="'+ data[i]['id'] +'">'+ String(1+i+((page-1)*50)) +'</a></center></td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['ibu'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['suami'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['anak_ke'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['tgl_lahir'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['bb'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['pb'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['tindakan'] +'</td>';
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
        html += '<a class="page-link" href="#" onclick="prevBersalin('+page+')">Sebelumnya</a>'
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
        html += '<a class="page-link" href="#" onclick="nextBersalin('+page+')" >Selanjutnya</a>'
    }
    html += '</li></ul></nav>';
    $('#content').html(html);

    $('#tbl-data-bersalin td').click(function() {
        var id = $(this).find("a").attr("id");
        if(id !== undefined){
            BersalinDetail(id);
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

function prevBersalin(page){
    t = $('#feature-bersalin-tahun').val();
    b = $('#feature-bersalin-bulan').val();
    BersalinView(getDataBersalin("all", b, t, page-1));
}

function nextBersalin(page){
    t = $('#feature-bersalin-tahun').val();
    b = $('#feature-bersalin-bulan').val();
    BersalinView(getDataBersalin("all", b, t, page+1));
}

function BersalinDetail(id){ 
    data = [];
    $.ajax({
        url: '/api/bersalin/'+id,
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            $('#detail-bersalin-id').val(data['id']);
            $('#detail-bersalin-bulan').val(data['bulan']);
            $('#detail-bersalin-tahun').val(data['tahun']);
            $('#detail-bersalin-suami').val(data['suami']);
            $('#detail-bersalin-nik-suami').val(data['nik_suami']);
            $('#detail-bersalin-ibu').val(data['ibu']);
            $('#detail-bersalin-nik-ibu').val(data['nik_ibu']);
            $('#detail-bersalin-anak-ke').val(data['anak_ke']);
            $('#detail-bersalin-bb').val(data['bb']);
            $('#detail-bersalin-pb').val(data['pb']);
            $('#detail-bersalin-ket').val(data['ket']);
            $('#detail-bersalin-rt').val(data['rt']);
            $('#detail-bersalin-tanggal').val(data['tgl_lahir']);
            $('#detail-bersalin-tindakan').val(data['tindakan']);
            $('#modal-detail-bersalin').modal('toggle');
        }
    });
}

function BersalinEdit(){
    txt = "Anda akan merubah data ini. Lanjutkan ?"
    var r = confirm(txt);
    if(r == true) {
        data = {
            'id' : $('#detail-bersalin-id').val(),
            'anak_ke' : $('#detail-bersalin-anak-ke').val(),
            'jarak' : $('#detail-bersalin-jarak').val(),
            'haid' : $('#detail-bersalin-haid').val(),
            'tgl_lahir' : $('#detail-bersalin-tanggal').val(),
            'bb' : $('#detail-bersalin-bb').val(),
            'pb' : $('#detail-bersalin-pb').val(),
            'tindakan' : $('#detail-bersalin-tindakan').val(),
            'ket' : $('#detail-bersalin-ket').val()
        }
        
        url = '/api/bersalin/'+$('#detail-bersalin-id').val();

        $.ajax({
            method: 'put',
            contentType: "application/json; charset=utf-8",
            url: url,
            dataType: "json",
            data: JSON.stringify(data),
            success: function(res){
                toastr.success('Data berhasil diubah','Sukses');
                $('#modal-detail-bersalin').modal('toggle');
                initBersalin();
            }
        });

    }else{
        toastr.info('Data tidak diubah');
    }
}

function BersalinAdd(){
    data = {
        'bulan' : $('#tambah-bersalin-bulan').val(),
        'tahun' : $('#tambah-bersalin-tahun').val(),
        'nik_suami' : $('#tambah-bersalin-suami').val(),
        'nik_ibu' : $('#tambah-bersalin-ibu').val(),
        'anak_ke' : $('#tambah-bersalin-anak-ke').val(),
        'pb' : $('#tambah-bersalin-pb').val(),
        'bb' : $('#tambah-bersalin-bb').val(),
        'tgl_lahir' : $('#tambah-bersalin-tanggal').val(),
        'tindakan' : $('#tambah-bersalin-tindakan').val(),
        'ket' : $('#tambah-bersalin-ket').val()
    }

    $.ajax({
        method: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        url: '/api/bersalin',
        success: function(res){
            if(res['status'] == 200){
                $('#tambah-bersalin-tindakan').val("");
                $('#tambah-bersalin-tgl_lahir').val("");
                $('#tambah-bersalin-suami').val("");
                $('#tambah-bersalin-ibu').val("");
                $('#tambah-bersalin-anak-ke').val("");
                $('#tambah-bersalin-pb').val("");
                $('#tambah-bersalin-bb').val("");
                $('#tambah-bersalin-ket').val("");
                toastr.success('Data behasil ditambahkan', 'Sukses');
                $('#modal-tambah-bersalin').modal('toggle');
                initBersalin();
            }
        },
    });
}

function BersalinDelete(){
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
            url = '/api/bersalin/'+checked[i]
            $.ajax({
                method: 'delete',
                url: url,
                async: false,
                success: function(res){
                }
            });
        }
        toastr.success('Data berhasil dihapus','Sukses');
        initBersalin();

    }else{
        toastr.info('Data tidak dihapus');
    }
}

