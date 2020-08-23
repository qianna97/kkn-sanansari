function getDataPUS(search, tahun, page=1){
    ret = [];
    if(search == "all"){
        url = '/api/pus/tahun/'+tahun+'/page/'+page;
    }else{
        url = '/api/pus/nama/'+search;
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

function dataSelectSuami(){
    $.ajax({
        url: '/api/warga/suami',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#tambah-pus-suami').append($('<option>', {
                    value: data[i]['nik'],
                    text: data[i]['nama'] + ' - ' + data[i]['nik'] + ' - RT' + data[i]['rt']
                }));
            }
        }
    });
}

function dataSelectIsteri(){
    $.ajax({
        url: '/api/warga/isteri',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#tambah-pus-isteri').append($('<option>', {
                    value: data[i]['nik'],
                    text: data[i]['nama'] + ' - ' + data[i]['nik'] + ' - RT' + data[i]['rt']
                }));
            }
        }
    });
}

function dataSelectTahunPUS(){
    $.ajax({
        url: '/api/pus/tahun',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#feature-pus-tahun').append($('<option>', {
                    value: data[i],
                    text: data[i]
                }));
            }
        }
    });
}

function PUSFeature(){
    $('#card-header').show();
    html = '<div class="d-flex">'
    html += '<div class="mr-auto p-2">'
    html += '<div class="input-group">'
    html += '<select class="form-control border" id="feature-pus-tahun"></select>'
    html += '</div>'
    html += '</div>'
    html += '<div class="p-2">'
    html += '<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#modal-tambah-pus">'
    html += '<span class="fa fa-plus"></span> Tambah'
    html += '</button>'
    html += '</div>'
    html += '<div class="p-2">'
    html += '<button type="button" class="btn btn-danger btn-sm" onclick="PUSDelete()">'
    html += '<span class="fa fa-trash"></span> Hapus'
    html += '</button>'
    html += '</div>'
    html += '</div>'

    $('#content-feature').html(html);

    $('#feature-pus-tahun').change(function () {
        y = $(this).val();
        PUSView(getDataPUS("all", y));
    });
}

function PUSView(ret){
    document.getElementById("content-title").innerHTML = "Data PUS";
    $('#card-body').addClass('card-body');
    $('#card').addClass('card');

    data = ret['data']
    page = ret['page']
    next = ret['next']
    prev = ret['prev']

    html = "<table class='table' id='tbl-data-pus'>";
    html += "<tr class='bg-primary text-light'>"
    html += "<th rowspan='2'> </th>"
    html += '<th rowspan="2" style="text-align:center;vertical-align:middle;">No</th><th rowspan="2" style="text-align:center;vertical-align:middle;">Suami</th><th rowspan="2" style="text-align:center;vertical-align:middle;">Isteri</th><th rowspan="2" style="text-align:center;vertical-align:middle;">Jumlah Anak Hidup</th><th rowspan="2" style="text-align:center;vertical-align:middle;">Pengukuran LILA</th><th colspan="12" style="text-align:center;">Bulan</th><th rowspan="2" style="text-align:center;vertical-align:middle;">Tahun</th><th rowspan="2" style="text-align:center;vertical-align:middle;">Keterangan</th></tr>';
    html += '<tr class="bg-primary text-light"><th scope="col">1</th><th>2</th><th>3</th><th>4</th><th>5</th><th>6</th><th>7</th><th>8</th><th>9</th><th>10</th><th>11</th><th>12</th></tr>'
    for(i=0; i<data.length; i++){
        html += '<tr class="clickable-row" id="row-'+ data[i]['id'] +'">';
        html += '<td><input type="checkbox" id="'+ data[i]['id'] +'"></td>'
        html += '<td><center><a id="'+ data[i]['id'] +'">'+ String(1+i+((page-1)*50)) +'</a></center></td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['suami'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['isteri'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['jumlah_anak_hidup'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['pengukuran_lila'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['jan'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['feb'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['mar'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['apr'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['mei'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['jun'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['jul'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['ags'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['sep'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['okt'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['nov'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['des'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['tahun'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['ket'] +'</td>';
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
        html += '<a class="page-link" href="#" onclick="prevPUS('+page+')">Sebelumnya</a>'
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
        html += '<a class="page-link" href="#" onclick="nextPUS('+page+')" >Selanjutnya</a>'
    }
    html += '</li></ul></nav>';
    $('#content').html(html);

    $('#tbl-data-pus td').click(function() {
        var id = $(this).find("a").attr("id");
        if(id !== undefined){
            PUSDetail(id);
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

function prevPUS(page){
    t = $('#feature-pus-tahun').val()
    PUSView(getDataPUS("all", t, page-1));
}

function nextPUS(page){
    t = $('#feature-pus-tahun').val()
    PUSView(getDataPUS("all", t, page+1));
}

function PUSDetail(id){ 
    data = [];
    $.ajax({
        url: '/api/pus/'+id,
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            $('#detail-pus-id').val(data['id']);
            $('#detail-pus-suami').val(data['suami']);
            $('#detail-pus-nik-suami').val(data['nik_suami']);
            $('#detail-pus-isteri').val(data['isteri']);
            $('#detail-pus-nik-isteri').val(data['nik_isteri']);
            $('#detail-pus-jml-anak').val(data['jumlah_anak_hidup']);
            $('#detail-pus-rt').val(data['rt']);
            $('#detail-pus-lila').val(data['pengukuran_lila']);
            $('#detail-pus-tahun').val(data['tahun']);
            $('#detail-pus-jan').val(data['jan']);
            $('#detail-pus-feb').val(data['feb']);
            $('#detail-pus-mar').val(data['mar']);
            $('#detail-pus-apr').val(data['apr']);
            $('#detail-pus-mei').val(data['mei']);
            $('#detail-pus-jun').val(data['jun']);
            $('#detail-pus-jul').val(data['jul']);
            $('#detail-pus-ags').val(data['ags']);
            $('#detail-pus-sep').val(data['sep']);
            $('#detail-pus-okt').val(data['okt']);
            $('#detail-pus-nov').val(data['nov']);
            $('#detail-pus-des').val(data['des']);
            $('#detail-pus-ket').val(data['ket']);
            $('#modal-detail-pus').modal('toggle');
        }
    });
}

function PUSEdit(){
    txt = "Anda akan merubah data ini. Lanjutkan ?"
    var r = confirm(txt);
    if(r == true) {
        data = {
            'id' : $('#detail-pus-id').val(),
            'jumlah_anak_hidup' : $('#detail-pus-jml-anak').val(),
            'pengukuran_lila' : $('#detail-pus-lila').val(),
            'jan' : $('#detail-pus-jan').val(),
            'feb' : $('#detail-pus-feb').val(),
            'mar' : $('#detail-pus-mar').val(),
            'apr' : $('#detail-pus-apr').val(),
            'mei' : $('#detail-pus-mei').val(),
            'jun' : $('#detail-pus-jun').val(),
            'jul' : $('#detail-pus-jul').val(),
            'ags' : $('#detail-pus-ags').val(),
            'sep' : $('#detail-pus-sep').val(),
            'okt' : $('#detail-pus-okt').val(),
            'nov' : $('#detail-pus-nov').val(),
            'des' : $('#detail-pus-des').val(),
            'ket' : $('#detail-pus-ket').val()
        }
        
        url = '/api/pus/'+$('#detail-pus-id').val();

        $.ajax({
            method: 'put',
            contentType: "application/json; charset=utf-8",
            url: url,
            dataType: "json",
            data: JSON.stringify(data),
            success: function(res){
                toastr.success('Data berhasil diubah','Sukses');
                $('#modal-detail-pus').modal('toggle');
                initPUS();
            }
        });

    }else{
        toastr.info('Data tidak diubah');
    }
}

function PUSAdd(){
    data = {
        'nik_suami' : $('#tambah-pus-suami').val(),
        'nik_isteri' : $('#tambah-pus-isteri').val(),
        'jumlah_anak_hidup' : $('#tambah-pus-jml-anak').val(),
        'pengukuran_lila' : $('#tambah-pus-lila').val(),
        'tahun' : $('#tambah-pus-tahun').val(),
        'ket' : $('#tambah-pus-ket').val(),
        'jan' : $('#tambah-pus-jan').val(),
        'feb' : $('#tambah-pus-feb').val(),
        'mar' : $('#tambah-pus-mar').val(),
        'apr' : $('#tambah-pus-apr').val(),
        'mei' : $('#tambah-pus-mei').val(),
        'jun' : $('#tambah-pus-jun').val(),
        'jul' : $('#tambah-pus-jul').val(),
        'ags' : $('#tambah-pus-ags').val(),
        'sep' : $('#tambah-pus-sep').val(),
        'okt' : $('#tambah-pus-okt').val(),
        'nov' : $('#tambah-pus-nov').val(),
        'des' : $('#tambah-pus-des').val()
    }

    $.ajax({
        method: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        url: '/api/pus',
        success: function(res){
            if(res['status'] == 200){
                toastr.success('Data behasil ditambahkan', 'Sukses');
                $('#modal-tambah-pus').modal('toggle');
                initPUS();
            }
        },
    });
}

function PUSDelete(){
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
            url = '/api/pus/'+checked[i]
            $.ajax({
                method: 'delete',
                url: url,
                async: false,
                success: function(res){
                }
            });
        }
        toastr.success('Data berhasil dihapus','Sukses');
        PUSView(getDataPUS("all"))

    }else{
        toastr.info('Data tidak dihapus');
    }
}

