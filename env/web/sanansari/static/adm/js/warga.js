function getDataWarga(search, page=1){
    ret = [];
    if(search == "all"){
        url = '/api/warga/page/'+page;
    }else{
        url = '/api/warga/nama/'+search;
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

function wargaFeature(){
    $('#card-header').show();
    html = '<div class="d-flex">'
    html += '<div class="mr-auto p-2">'
    html += '<div class="input-group">'
    html += '<input class="form-control border" id="search-input" name="x" placeholder="Cari Nama">'
    html += '<span class="input-group-append">'
    html += '<button class="btn btn-outline-secondary border-left-0 border" onclick="wargaSearch();" type="button">'
    html += '<i class="fa fa-search"></i>'
    html += '</button>'
    html += '</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="p-2">'
    html += '<button type="button" class="btn btn-success btn-sm" data-toggle="modal" data-target="#modal-tambah-warga">'
    html += '<span class="fa fa-plus"></span> Tambah'
    html += '</button>'
    html += '</div>'
    html += '<div class="p-2">'
    html += '<button type="button" class="btn btn-danger btn-sm" onclick="wargaDelete()">'
    html += '<span class="fa fa-trash"></span> Hapus'
    html += '</button>'
    html += '</div>'
    html += '</div>'

    $('#content-feature').html(html);
}

function wargaView(ret){
    document.getElementById("content-title").innerHTML = "Data Warga";
    $('#card-body').addClass('card-body');
    $('#card').addClass('card');

    data = ret['data']
    page = ret['page']
    next = ret['next']
    prev = ret['prev']

    html = "<table class='table' id='tbl-data-warga'>";
    html += "<tr class='bg-primary text-light'>"
    html += "<th> </th>"
    html += "<th>No</th><th>Nama</th><th>NIK</th><th>Jenis Kelamin</th><th>Tanggal Lahir</th><th>Agama</th><th>Pendidikan</th><th>Pekerjaan</th><th>Status</th></tr>";
    for(i=0; i<data.length; i++){
        html += '<tr class="clickable-row" id="row-'+ data[i]['id'] +'">';
        html += '<td><input type="checkbox" id="'+ data[i]['id'] +'"></td>'
        html += '<td><center><a id="'+ data[i]['id'] +'">'+ String(1+i+((page-1)*50)) +'</a></center></td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['nama'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['nik'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['jenis_kelamin'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['tgl_lahir'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['agama'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['pendidikan'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['pekerjaan'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['status_kawin'] +'</td>';
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
        html += '<a class="page-link" href="#" onclick="prevWarga('+page+')">Sebelumnya</a>'
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
        html += '<a class="page-link" href="#" onclick="nextWarga('+page+')" >Selanjutnya</a>'
    }
    html += '</li></ul></nav>';
    $('#content').html(html);

    $('#tbl-data-warga td').click(function() {
        var id = $(this).find("a").attr("id");
        if(id !== undefined){
            wargaDetail(id);
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

function prevWarga(page){
    wargaView(getDataWarga("all", page-1));
}

function nextWarga(page){
    wargaView(getDataWarga("all", page+1));
}

function wargaSearch(){
    nama = $('#search-input').val();
    if(nama == ""){
        wargaView(getDataWarga("all"));
    }else{
        wargaView(getDataWarga(nama));
    }
}

function wargaDetail(id){
    data = [];
    $.ajax({
        url: '/api/warga/'+id,
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            $('#detail-id').val(data['id']);
            $('#detail-nama').val(data['nama']);
            $('#detail-nik').val(data['nik']);
            $('#detail-kelamin').val(data['jenis_kelamin']);
            $('#detail-rt').val(data['rt']);
            $('#detail-kk').val(data['no_kk']);
            $('#detail-hubungan').val(data['hubungan_kk']);
            $('#detail-status').val(data['status_kawin']);
            $('#detail-tanggal-lahir').val(data['tgl_lahir']);
            $('#detail-agama').val(data['agama']);
            $('#detail-pendidikan').val(data['pendidikan']);
            $('#detail-pekerjaan').val(data['pekerjaan']);
            $('#modal-detail-warga').modal('toggle');
        }
    });
}

function wargaEdit(){
    txt = "Anda akan merubah data ini. Lanjutkan ?"
    var r = confirm(txt);
    if(r == true) {
        data = {
            'id' : $('#detail-id').val(),
            'nama' : $('#detail-nama').val().toUpperCase(),
            'nik' : $('#detail-nik').val(),
            'no_kk' : $('#detail-kk').val(),
            'hubungan_kk' : $('#detail-hubungan').val(),
            'status_kawin' : $('#detail-status').val(),
            'jenis_kelamin' : $('#detail-kelamin').val(),
            'rt' : $('#detail-rt').val(),
            'tgl_lahir' : $('#detail-tanggal-lahir').val(),
            'agama' : $('#detail-agama').val().toUpperCase(),
            'pendidikan' : $('#detail-pendidikan').val(),
            'pekerjaan' : $('#detail-pekerjaan').val().toUpperCase()
        }

        url = '/api/warga/'+$('#detail-id').val()

        $.ajax({
            method: 'put',
            contentType: "application/json; charset=utf-8",
            url: url,
            dataType: "json",
            data: JSON.stringify(data),
            success: function(res){
                toastr.success('Data berhasil diubah','Sukses');
                $('#modal-detail-warga').modal('toggle');
                wargaView(getDataWarga("all"))
            }
        });

    }else{
        toastr.info('Data tidak diubah');
    }
}

$('#tambah-warga').on('submit', function (event) {
      event.preventDefault();
      var formData = new FormData();
      data = {
          'nama' : $('#tambah-nama').val().toUpperCase(),
          'nik' : $('#tambah-nik').val(),
          'no_kk' : $('#tambah-kk').val(),
          'hubungan_kk' : $('#tambah-hubungan').val(),
          'status_kawin' : $('#tambah-status').val(),
          'jenis_kelamin' : $('#tambah-kelamin').val(),
          'rt' : $('#tambah-rt').val(),
          'tgl_lahir' : $('#tambah-tanggal-lahir').val(),
          'agama' : $('#tambah-agama').val().toUpperCase(),
          'pendidikan' : $('#tambah-pendidikan').val(),
          'pekerjaan' : $('#tambah-pekerjaan').val().toUpperCase()
      }

      formData.append('nama', data['nama']);
      formData.append('nik', data['nik']);
      formData.append('no_kk', data['no_kk']);
      formData.append('hubungan_kk', data['hubungan_kk']);
      formData.append('status_kawin', data['status_kawin']);
      formData.append('jenis_kelamin', data['jenis_kelamin']);
      formData.append('rt', data['rt']);
      formData.append('tgl_lahir', data['tgl_lahir']);
      formData.append('agama', data['agama']);
      formData.append('pendidikan', data['pendidikan']);
      formData.append('pekerjaan', data['pekerjaan']);


      $.ajax({
          method: 'post',
          data: formData,
          processData: false,
          contentType: false,
          url: '/api/warga',
          success: function(res){
              if(res['status'] == 200){
                  $('#tambah-nama').val("");
                  $('#tambah-nik').val("");
                  $('#tambah-kk').val("");
                  $('#tambah-hubungan').val("");
                  $('#tambah-status').val("");
                  $('#tambah-kelamin').val("");
                  $('#tambah-rt').val("");
                  $('#tambah-tanggal-lahir').val("");
                  $('#tambah-agama').val("");
                  $('#tambah-pendidikan').val("");
                  $('#tambah-pekerjaan').val("");
                  toastr.success('Data behasil ditambahkan', 'Sukses');
                  $('#modal-tambah-warga').modal('toggle');
                  initWarga();
              }
          },
      });
      
});

function wargaDelete(){
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
            url = '/api/warga/'+checked[i]
            $.ajax({
                method: 'delete',
                url: url,
                async: false,
                success: function(res){
                }
            });
        }
        toastr.success('Data berhasil dihapus','Sukses');
        wargaView(getDataWarga("all"))

    }else{
        toastr.info('Data tidak dihapus');
    }
}
