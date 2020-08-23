function getDataUsia(search, page=1){
    ret = [];
    if(search == "all"){
        url = '/api/usia/page/'+page;
    }else{
        url = '/api/usia/nama/'+search;
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

function UsiaFeature(){
    $('#card-header').show();
    html = '<div class="d-flex"> \
    <div class="mr-auto p-2"> \
    <p> \
    0 - 4 Tahun : Masa Balita <br>\
    5 - 11 Tahun : Masa Kanak-kanak <br>\
    12 - 16 Tahun : Masa Remaja Awal <br>\
    17 - 25 Tahun : Masa Remaja Akhir <br>\
    26 - 35 Tahun : Masa Dewasa Awal <br>\
    36 - 45 Tahun : Masa Dewasa Akhir <br>\
    46 - 55 Tahun : Masa Lansia Awal <br>\
    56 - 65 Tahun : Masa Lansia Akhir <br>\
    > 67 Tahun : Masa Manula \
    </p> \
    <div class="input-group"> \
    <input class="form-control border" id="search-input" name="x" placeholder="Cari Nama"> \
    <span class="input-group-append"> \
    <button class="btn btn-outline-secondary border-left-0 border" onclick="UsiaSearch();" type="button"> \
    <i class="fa fa-search"></i> \
    </button> \
    </span> \
    </div> \
    </div> \
    </div>';

    $('#content-feature').html(html);
}

function UsiaView(ret){
    document.getElementById("content-title").innerHTML = "Rentang Usia";
    $('#card-body').addClass('card-body');
    $('#card').addClass('card');

    data = ret['data']
    page = ret['page']
    next = ret['next']
    prev = ret['prev']

    html = "<table class='table' id='tbl-data-usia'>";
    html += "<tr class='bg-primary text-light'>"
    html += "<th style='text-align:center;'>No</th><th>Nama</th><th>NIK</th><th>Tanggal Lahir</th><th>Usia (Thn)</th><th>Keterangan</th><th>RT</th></tr>";
    for(i=0; i<data.length; i++){
        html += '<tr class="clickable-row" id="row-'+ data[i]['id'] +'">';
        html += '<td><center><a id="'+ data[i]['id'] +'">'+ String(1+i+((page-1)*50)) +'</a></center></td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['nama'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['nik'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['tgl_lahir'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['usia'] +'</td>';
        html += '<td><a id="'+ data[i]['id'] +'"></a>'+ data[i]['rentang'] +'</td>';
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
        html += '<a class="page-link" href="#" onclick="prevUsia('+page+')">Sebelumnya</a>'
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
        html += '<a class="page-link" href="#" onclick="nextUsia('+page+')" >Selanjutnya</a>'
    }
    html += '</li></ul></nav>';
    $('#content').html(html);
}

function prevUsia(page){
    t = $('#feature-pus-tahun').val()
    UsiaView(getDataUsia("all", t, page-1));
}

function nextUsia(page){
    t = $('#feature-pus-tahun').val()
    UsiaView(getDataUsia("all", t, page+1));
}

function UsiaSearch(){
    nama = $('#search-input').val();
    if(nama == ""){
        UsiaView(getDataUsia("all"));
    }else{
        UsiaView(getDataUsia(nama));
    }
}
