$(document).ready(function(){
    getTable();
})


const getTable = () => {
    $.ajax({
        url: 'http://localhost:3000/data/meja',
        success: (data) => {
            let tables = ""
            
            data.forEach((table) => {
                if(table.exist == 1){
                    tables += `
                    <div class="col-lg-2" data-id="${table.id}">
                        <div class="table exist">
                            <h1 class="f-nunito-5">Meja No ${table.no_meja}</h1>
                        </div>
                    </div>`
                }else{
                    tables += ` 
                    <div class="col-lg-2" data-id="${table.id}">
                        <a href="/kasir/meja/pesanan/${table.id}">
                            <div class="table">
                                <h1 class="f-nunito-5">Meja No ${table.no_meja}</h1>
                            </div>
                        </a>
                    </div>
                    `
                }
            })

            $("#table").html(tables)
        },
        error: (err) => {
            console.log(err)
        }
    })
}