function getBlog(search){
    ret = [];
    if(search == "all"){
        url = '/admin/post';
    }else{
        url = '/admin/post/title/'+search;
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

function listPostFeature(){
    $('#card-header').show();
    html = '<div class="d-flex">'
    html += '<div class="mr-auto p-2">'
    html += '<div class="input-group">'
    html += '<input class="form-control border" id="search-post" name="x" placeholder="Cari Judul">'
    html += '<span class="input-group-append">'
    html += '<button class="btn btn-outline-secondary border-left-0 border" onclick="listPostSearch();" type="button">'
    html += '<i class="fa fa-search"></i>'
    html += '</button>'
    html += '</span>'
    html += '</div>'
    html += '</div>'
    html += '<div class="p-2">'
    html += '<button type="button" class="btn btn-danger btn-sm" onclick="listPostDelete()">'
    html += '<span class="fa fa-trash"></span> Hapus'
    html += '</button>'
    html += '</div>'
    html += '</div>'

    $('#content-feature').html(html);
}

function listPostView(data){
    document.getElementById("content-title").innerHTML = "Artikel";
    $('#card-body').addClass('card-body');
    $('#card').addClass('card');

    html = "<table class='table' id='tbl-data-post'>";
    html += "<tr class='bg-primary text-light'>"
    html += "<th> </th>"
    html += "<th>No</th><th>Judul</th><th>Kategori</th><th>Tanggal Rilis</th></tr>";
    for(i=0; i<data.length; i++){
        html += '<tr class="clickable-row" id="row-'+ data[i]['id'] +'">';
        html += '<td style="width:10px"><input type="checkbox" id="'+ data[i]['id'] +'"></td>'
        html += '<td style="width:10px"><center><a id="'+ data[i]['id'] +'">'+ String(i+1) +'</a></center></td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['title'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['category_name'] +'</td>';
        html += '<td style="width:50%"><a id="'+ data[i]['id'] +'"></a>'+ data[i]['date_posted'] +'</td>';
        html += '</tr>';
    }
    html += "</table>";
    
    $('#content').html(html);

    $('#tbl-data-post td').click(function() {
        var id = $(this).find("a").attr("id");
        if(id !== undefined){
            listPostDetail(id);
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

function listPostSearch(){
    title = $('#search-post').val();
    if(title == ""){
        listPostView(getBlog("all"));
    }else{
        listPostView(getBlog(title));
    }
}

function listPostDetail(id){
    $('#summernote2').summernote();
    data = [];
    $.ajax({
        url: '/admin/post/'+id,
        dataType: 'json',
        method: 'get',
        async: true,
        success: function(ret){
            data = ret;
            $('#detail-post').val(data['id']);
            $('#detail-title').val(data['title']);
            $('#detail-category').val(data['category_name']);
            $('#summernote2').summernote('code', data['content']);
            $('#modal-detail-post').modal('toggle');
        }
    });
}

function listPostDelete(){
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
            url = '/admin/post/'+checked[i]
            $.ajax({
                method: 'delete',
                url: url,
                async: false,
                success: function(res){
                }
            });
        }
        toastr.success('Data berhasil dihapus','Sukses');
        listPostView(getBlog("all"));

    }else{
        toastr.info('Data tidak dihapus');
    }
}

function listPostEdit(){
    id = $('#detail-post').val();
    txt = "Anda akan merubah data ini. Lanjutkan ?"
    var r = confirm(txt);
    if(r == true) {
        data = {
            'id' : id,
            'title' : $('#detail-title').val(),
            'category' : $('#detail-category').val(),
            'content' : $('#summernote2').val()
        }
        
        url = '/admin/post/'+id;

        $.ajax({
            method: 'put',
            contentType: "application/json; charset=utf-8",
            url: url,
            dataType: "json",
            data: JSON.stringify(data),
            success: function(res){
                toastr.success('Data berhasil diubah','Sukses');
                $('#modal-detail-post').modal('toggle');
                listPostView(getBlog("all"));
            }
        });

    }else{
        toastr.info('Data tidak diubah');
    }
}