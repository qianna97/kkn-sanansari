function getDataKB(search){
    ret = [];
    if(search == "all"){
        url = '/api/kb';
    }else{
        url = '/api/kb/nama/'+search;
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

function KBFeature(){
    $('#card-header').show();
    html = '<div class="d-flex">'
    html += '<div class="mr-auto p-2">'
    html += '<div class="input-group">'
    html += '<input class="form-control border" id="search-input" name="x" placeholder="Cari Nama">'
    html += '<span class="input-group-append">'
    html += '<button class="btn btn-outline-secondary border-left-0 border" onclick="KBSearch();" type="button">'
    html += '<i class="fa fa-search"></i>'
    html += '</button>'
    html += '</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="p-2">'
    html += '<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#modal-tambah-kb">'
    html += '<span class="fa fa-plus"></span> Tambah'
    html += '</button>'
    html += '</div>'
    html += '<div class="p-2">'
    html += '<button type="button" class="btn btn-danger btn-sm" onclick="KBDelete()">'
    html += '<span class="fa fa-trash"></span> Hapus'
    html += '</button>'
    html += '</div>'
    html += '</div>'
    $('#content-feature').html(html);
    
    nik_non = []
    $.ajax({
        url: '/api/kb/non',
        dataType: 'json',
        method: 'get',
        async: false,
        success: function(data){
            nik_non = data;
        }
    });

    html = "<td>NIK</td>"
    html += '<td><select class="form-control border" id="tambah-kb-nik">';
    for(i=0;i<nik_non.length;i++){
        html += '<option>'+nik_non[i]+'</option>';
    }
    html += '</select></td>'
    $('#nik-non-kb').html(html);

    $('#tambah-kb-nik').click(function(){
        nik = $(this).val();
        data_ = [];
        $.ajax({
            url: '/api/warga/nik/'+nik,
            dataType: 'json',
            method: 'get',
            async: false,
            success: function(ret){
                data_ = ret[0];
            }
        });
        if(data_){
            $('#tambah-kb-nama').val(data_['nama']);
        }
    });

    
}

function KBView(data){
    document.getElementById("content-title").innerHTML = "Data KB";
    $('#card-body').addClass('card-body');
    $('#card').addClass('card');

    html = "<table class='table' id='tbl-data-kb'>";
    html += "<tr class='bg-primary text-light'>"
    html += "<th> </th>"
    html += "<th>No</th><th>Nama</th><th>NIK</th><th>Metode</th></tr>";
    for(i=0; i<data.length; i++){
        html += '<tr class="clickable-row" id="row-'+ data[i]['id'] +'">';
        html += '<td style="width: 1%;white-space: nowrap;"><input type="checkbox" id="'+ data[i]['id'] +'"></td>'
        html += '<td style="width: 1%;white-space: nowrap;"><center><a id="'+ data[i]['id'] +'">'+ String(i+1) +'</a></center></td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['nama'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['nik'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['metode'] +'</td>';
        html += '</tr>';
    }
    html += "</table>";
    
    $('#content').html(html);

    $('#tbl-data-kb td').click(function() {
        var id = $(this).find("a").attr("id");
        if(id !== undefined){
            KBDetail(id);
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

function KBSearch(){
    nama = $('#search-input').val();
    if(nama == ""){
        KBView(getDataKB("all"));
    }else{
        KBView(getDataKB(nama));
    }
}

function KBDetail(id){ 
    data = [];
    $.ajax({
        url: '/api/kb/'+id,
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            $('#detail-kb-id').val(data[0]['id']);
            $('#detail-kb-nama').val(data[0]['nama']);
            $('#detail-kb-nik').val(data[0]['nik']);
            $('#detail-kb-metode').val(data[0]['metode']);
            $('#modal-detail-kb').modal('toggle');
        }
    });
    
}

function KBAdd(){
    data = {
        'metode' : $('#tambah-kb-metode').val(),
        'nik' : $('#tambah-kb-nik').val()
    }

    $.ajax({
        method: 'post',
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        data: JSON.stringify(data),
        url: '/api/kb',
        success: function(res){
            if(res['status'] == 200){
                $('#tambah-kb-nama').val("");
                $('#tambah-kb-nik').val("");
                toastr.success('Data behasil ditambahkan', 'Sukses');
                $('#modal-tambah-kb').modal('toggle');
                initKB();
            }
        },
    });
}

function KBDelete(){
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
            url = '/api/kb/'+checked[i]
            $.ajax({
                method: 'delete',
                url: url,
                async: false,
                success: function(res){
                }
            });
        }
        toastr.success('Data berhasil dihapus','Sukses');
        initKB();

    }else{
        toastr.info('Data tidak dihapus');
    }
}

function KBEdit(){
    txt = "Anda akan merubah data ini. Lanjutkan ?"
    var r = confirm(txt);
    if(r == true) {
        data = {
            'id' : $('#detail-kb-id').val(),
            'metode' : $('#detail-kb-metode').val(),
        }
        
        url = '/api/kb/'+$('#detail-kb-id').val()

        $.ajax({
            method: 'put',
            contentType: "application/json; charset=utf-8",
            url: url,
            dataType: "json",
            data: JSON.stringify(data),
            success: function(res){
                toastr.success('Data berhasil diubah','Sukses');
                $('#modal-detail-kb').modal('toggle');
                KBView(getDataKB("all"));
            }
        });

    }else{
        toastr.info('Data tidak diubah');
    }
}
