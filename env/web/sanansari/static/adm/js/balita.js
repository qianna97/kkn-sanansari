function getDataBalita(search, bulan, tahun, page=1){
    ret = [];
    if(search == "all"){
        url = '/api/balita/tahun/'+tahun+'/bulan/'+bulan+'/page/'+page;
    }else{
        url = '/api/balita/nama/'+search;
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

function dataSelectAnak(){
    $.ajax({
        url: '/api/warga/balita',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#tambah-balita-anak').append($('<option>', {
                    value: data[i]['nik'],
                    text: data[i]['nama'] + ' - ' + data[i]['nik'] + ' - RT' + data[i]['rt']
                }));
            }
        }
    });
}

function dataSelectIbu(){
    $.ajax({
        url: '/api/warga/isteri',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#tambah-balita-ibu').append($('<option>', {
                    value: data[i]['nik'],
                    text: data[i]['nama'] + ' - ' + data[i]['nik'] + ' - RT' + data[i]['rt']
                }));
            }
        }
    });
}

function dataSelectTahunBalita(){
    $.ajax({
        url: '/api/balita/tahun',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#feature-balita-tahun').append($('<option>', {
                    value: data[i],
                    text: data[i]
                }));
            }
        }
    });
}

function BalitaFeature(){
    $('#card-header').show();
    html = 
    '<div class="d-flex"> \
        <div class="mr-auto p-2"> \
            <div class="input-group"> \
                <select class="form-control border" id="feature-balita-bulan"> \
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
                <select class="form-control border" id="feature-balita-tahun"></select> \
            </div> \
        </div> \
        <div class="p-2"> \
            <button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#modal-tambah-balita"> \
                <span class="fa fa-plus"></span> Tambah \
            </button> \
        </div> \
        <div class="p-2"> \
            <button type="button" class="btn btn-danger btn-sm" onclick="BalitaDelete()"> \
                <span class="fa fa-trash"></span> Hapus \
            </button> \
        </div> \
    </div>';

    $('#content-feature').html(html);

    $('#feature-balita-tahun').change(function () {
        y = $(this).val();
        m = $('#feature-balita-bulan').val()
        BalitaView(getDataBalita("all", m, y));
    });

    $('#feature-balita-bulan').change(function () {
        m = $(this).val();
        y = $('#feature-balita-tahun').val()
        BalitaView(getDataBalita("all", m, y));
    });
}

function BalitaView(ret){
    document.getElementById("content-title").innerHTML = "Data Perkembangan Balita";
    $('#card-body').addClass('card-body');
    $('#card').addClass('card');

    data = ret['data']
    page = ret['page']
    next = ret['next']
    prev = ret['prev']

    html = "<table class='table' id='tbl-data-balita'>";
    html += "<tr class='bg-primary text-light'>"
    html += "<th> </th>"
    html += '<th>No</th><th>Anak</th><th>Ibu</th><th>Anak ke-</th><th>Berat Badan (kg)</th><th>Tinggi Badan (cm)</th><th>ASI Eksklusif</th><th>Vitamin A</th><th>RT</th></tr>';
    for(i=0; i<data.length; i++){
        html += '<tr class="clickable-row" id="row-'+ data[i]['id'] +'">';
        html += '<td><input type="checkbox" id="'+ data[i]['id'] +'"></td>'
        html += '<td><center><a id="'+ data[i]['id'] +'">'+ String(1+i+((page-1)*50)) +'</a></center></td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['anak'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['ibu'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['anak_ke'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['bb'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['tb'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['asi'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['vit_a'] +'</td>';
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
        html += '<a class="page-link" href="#" onclick="prevBalita('+page+')">Sebelumnya</a>'
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
        html += '<a class="page-link" href="#" onclick="nextBalita('+page+')" >Selanjutnya</a>'
    }
    html += '</li></ul></nav>';
    $('#content').html(html);

    $('#tbl-data-balita td').click(function() {
        var id = $(this).find("a").attr("id");
        if(id !== undefined){
            BalitaDetail(id);
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

function prevBalita(page){
    t = $('#feature-balita-tahun').val();
    b = $('#feature-balita-bulan').val();
    BalitaView(getDataBalita("all", b, t, page-1));
}

function nextBalita(page){
    t = $('#feature-balita-tahun').val();
    b = $('#feature-balita-bulan').val();
    BalitaView(getDataBalita("all", b, t, page+1));
}

function BalitaDetail(id){ 
    data = [];
    $.ajax({
        url: '/api/balita/'+id,
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            $('#detail-balita-id').val(data['id']);
            $('#detail-balita-bulan').val(data['bulan']);
            $('#detail-balita-tahun').val(data['tahun']);
            $('#detail-balita-anak').val(data['anak']);
            $('#detail-balita-nik-anak').val(data['nik_anak']);
            $('#detail-balita-ibu').val(data['ibu']);
            $('#detail-balita-nik-ibu').val(data['nik_ibu']);
            $('#detail-balita-anak-ke').val(data['anak_ke']);
            $('#detail-balita-bb').val(data['bb']);
            $('#detail-balita-tb').val(data['tb']);
            $('#detail-balita-asi').val(data['asi']);
            $('#detail-balita-vit-a').val(data['vit_a']);
            $('#detail-balita-rt').val(data['rt']);
            $('#modal-detail-balita').modal('toggle');
        }
    });
}

function BalitaEdit(){
    txt = "Anda akan merubah data ini. Lanjutkan ?"
    var r = confirm(txt);
    if(r == true) {
        data = {
            'id' : $('#detail-balita-id').val(),
            'anak_ke' : $('#detail-balita-anak-ke').val(),
            'bb' : $('#detail-balita-bb').val(),
            'tb' : $('#detail-balita-tb').val(),
            'asi' : $('#detail-balita-asi').val(),
            'vit_a' : $('#detail-balita-vit-a').val()
        }
        
        url = '/api/balita/'+$('#detail-balita-id').val();

        $.ajax({
            method: 'put',
            contentType: "application/json; charset=utf-8",
            url: url,
            dataType: "json",
            data: JSON.stringify(data),
            success: function(res){
                toastr.success('Data berhasil diubah','Sukses');
                $('#modal-detail-balita').modal('toggle');
                initBalita();
            }
        });

    }else{
        toastr.info('Data tidak diubah');
    }
}

function BalitaAdd(){
    data = {
        'bulan' : $('#tambah-balita-bulan').val(),
        'tahun' : $('#tambah-balita-tahun').val(),
        'nik_anak' : $('#tambah-balita-anak').val(),
        'nik_ibu' : $('#tambah-balita-ibu').val(),
        'anak_ke' : $('#tambah-balita-anak-ke').val(),
        'bb' : $('#tambah-balita-bb').val(),
        'tb' : $('#tambah-balita-tb').val(),
        'asi' : $('#tambah-balita-asi').val(),
        'vit_a' : $('#tambah-balita-vit-a').val()
    }

    $.ajax({
        method: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        url: '/api/balita',
        success: function(res){
            if(res['status'] == 200){
                $('#tambah-balita-anak-ke').val();
                $('#tambah-balita-bb').val();
                $('#tambah-balita-tb').val();
                $('#tambah-balita-asi').val();
                $('#tambah-balita-vit-a').val();
                toastr.success('Data behasil ditambahkan', 'Sukses');
                $('#modal-tambah-balita').modal('toggle');
                initBalita();
            }
        },
    });
}

function BalitaDelete(){
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
            url = '/api/balita/'+checked[i]
            $.ajax({
                method: 'delete',
                url: url,
                async: false,
                success: function(res){
                }
            });
        }
        toastr.success('Data berhasil dihapus','Sukses');
        initBalita();

    }else{
        toastr.info('Data tidak dihapus');
    }
}

