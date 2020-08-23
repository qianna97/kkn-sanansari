function getDataProduk(search){
    ret = [];
    if(search == "all"){
        url = '/api/produk';
    }else{
        url = '/api/produk/nama/'+search;
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

function produkFeature(){
    $('#card-header').show();
    html = '<div class="d-flex">'
    html += '<div class="mr-auto p-2">'
    html += '<div class="input-group">'
    html += '<input class="form-control border" id="search-input" name="x" placeholder="Cari Produk">'
    html += '<span class="input-group-append">'
    html += '<button class="btn btn-outline-secondary border-left-0 border" onclick="produkSearch();" type="button">'
    html += '<i class="fa fa-search"></i>'
    html += '</button>'
    html += '</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="p-2">'
    html += '<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#modal-tambah-produk">'
    html += '<span class="fa fa-plus"></span> Tambah'
    html += '</button>'
    html += '</div>'
    html += '<div class="p-2">'
    html += '<button type="button" class="btn btn-danger btn-sm" onclick="produkDelete()">'
    html += '<span class="fa fa-trash"></span> Hapus'
    html += '</button>'
    html += '</div>'
    html += '</div>'

    $('#content-feature').html(html);
}

function produkView(data){
    document.getElementById("content-title").innerHTML = "Data Produk";
    $('#card-body').addClass('card-body');
    $('#card').addClass('card');

    html = "<table class='table' id='tbl-data-produk'>";
    html += "<tr class='bg-primary text-light'>"
    html += "<th> </th>"
    html += "<th>Nama Produk</th><th>Jenis</th><th>Harga</th><th>Keterangan</th></tr>";
    for(i=0; i<data.length; i++){
        html += '<tr class="clickable-row" id="row-'+ data[i]['id'] +'">';
        html += '<td><input type="checkbox" id="'+ data[i]['id'] +'"></td>'
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['nama'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['jenis'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['harga'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['ket'] +'</td>';
        html += '</tr>';
    }
    html += "</table>";

    $('#content').html(html);

    $('#tbl-data-produk td').click(function() {
        var id = $(this).find("a").attr("id");
        if(id !== undefined){
            produkDetail(id);
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

function dataSelectJenis(){
    $.ajax({
        url: '/api/jenis',
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            for(i=0;i<data.length;i++){
                $('#detail-produk-jenis').append($('<option>', {
                    value: data[i]['id'],
                    text: data[i]['nama']
                }));
                $('#tambah-produk-jenis').append($('<option>', {
                    value: data[i]['id'],
                    text: data[i]['nama']
                }));
            }
        }
    });
}

function produkSearch(){
    nama = $('#search-input').val();
    if(nama == ""){
        produkView(getDataProduk("all"));
    }else{
        produkView(getDataProduk(nama));
    }
}

function produkDetail(id){
    data = [];
    $.ajax({
        url: '/api/produk/'+id,
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            src = "static/images/produk_images/"+data['img'];
            harga = data['harga'].split("/")
            $('#detail-produk-img').attr('src', src);
            $('#detail-produk-id').val(data['id']);
            $('#detail-produk-nama').val(data['nama']);
            $('#detail-produk-jenis').val(data['jenis_id']);
            $('#detail-produk-ket').val(data['ket']);
            $('#detail-produk-harga').val(harga[0]);
            $('#detail-produk-satuan').val(harga[1]);
            $('#modal-detail-produk').modal('toggle');
        }
    });
}

function produkEdit(){
    txt = "Anda akan merubah data ini. Lanjutkan ?"
    var r = confirm(txt);
    if(r == true) {
        harga = harga = $('#detail-produk-harga').val()+"/"+$('#detail-produk-satuan').val()
        data = {
            'id' : $('#detail-produk-id').val(),
            'nama' : $('#detail-produk-nama').val(),
            'jenis_id' : $('#detail-produk-jenis').val(),
            'ket' : $('#detail-produk-ket').val(),
            'harga' : harga
        }

        url = '/api/produk/'+$('#detail-produk-id').val()

        $.ajax({
            method: 'put',
            contentType: "application/json; charset=utf-8",
            url: url,
            dataType: "json",
            data: JSON.stringify(data),
            success: function(res){
                toastr.success('Data berhasil diubah','Sukses');
                $('#modal-detail-produk').modal('toggle');
                initProduk();
            }
        });

    }else{
        toastr.info('Data tidak diubah');
    }
}

$('#tambah-produk').on('submit', function (event) {
    event.preventDefault();

    var files = $('#produk-input-img').get(0).files,
        formData = new FormData();

    if (files.length > 1) {
        alert('Upload maksimal 1 file');
        return false;
    }

    for (var i=0; i < files.length; i++) {
        var file = files[i];
        formData.append('datas[]', file, file.name);
    }

    harga = $('#tambah-produk-harga').val()+"/"+$('#tambah-produk-satuan').val()
    formData.append('nama', $('#tambah-produk-nama').val());
    formData.append('jenis_id', $('#tambah-produk-jenis').val());
    formData.append('harga', harga);
    formData.append('ket', $('#tambah-produk-ket').val());

    $.ajax({
        url: '/api/produk',
        method: 'post',
        data: formData,
        processData: false,
        contentType: false,
        beforeSend: function() {
            toastr.info('Sedang proses unggah', 'Tunggu');
        },
        success: function(data) {
            if(data['status']){
                $('#modal-tambah-produk').modal('toggle');
                toastr.success('Data berhasil diunggah pada server', 'Sukses');
                initProduk();
            }else{
                toastr.error(data['message'], 'Galat');
            }
            $('#produk-input-img').val("");
            $('#tambah-produk-ket').val("")
            $('#tambah-produk-jenis').val("")
            $('#tambah-produk-nama').val("")
            $('#tambah-produk-harga').val("")
            $('#tambah-produk-satuan').val("")
        }
    });
});

function produkDelete(){
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
            url = '/api/produk/'+checked[i]
            $.ajax({
                method: 'delete',
                url: url,
                async: false,
                success: function(res){
                }
            });
        }
        toastr.success('Data berhasil dihapus','Sukses');
        initProduk()

    }else{
        toastr.info('Data tidak dihapus');
    }
}
