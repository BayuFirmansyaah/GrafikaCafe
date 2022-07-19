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
                    <div class="col-lg-2">
                        <div class="table bg-red" data-id="${table.id}">
                            <h1 class="f-nunito-5">Meja No ${table.no_meja}</h1>
                        </div>
                    </div>`
                }
            })

            $("#table").html(tables)
            updateTable()
        },
        error: (err) => {
            console.log(err)
        }
    })
}

const updateTable = () => {
    const meja = document.querySelectorAll('.table')

    meja.forEach((meja)=>{
        meja.addEventListener('click',function(){
            const id = parseInt(this.getAttribute('data-id'))

            $.ajax({
                url:"http://localhost:3000/kasir/meja/clear",
                type: "PUT",
                dataType: "application/json",
                data: {id},
                success: (res) => {
                    alert("meja berhasil diperbarui")
                    getTable();
                },
                error: (err) => {
                    alert("meja berhasil diperbarui")
                    getTable()
                }
            })
        })
    })
}