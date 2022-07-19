$(document).ready(function(){
    // get data menu
    getMenu()

    // get data category form
    getCategory()

    // update menu
    updateMenu()

    // delete menu
    deleteMenu()
})


const getMenu = () => {
    $.ajax({
        url: 'http://localhost:3000/data/menu',
        success : (res) => {
            let number = 1
            let data
            let currency

            res.forEach((menu) => {
                // convert money
                currency = convertCurrency(menu.harga)

                console.log(menu)

                data += `
                <tr>
                    <th scope="row" class="text-center">${number}</th>
                    <td>
                    <input type="checkbox" class="id-menu" data-id="${menu.id}" style="margin-left:10px">
                    </td>
                    <td>${menu.nama}</td>
                    <td>${menu.stock}</td>
                    <td>${menu.kategori}</td>
                    <td>${currency}</td>
                    <td><img src="/img/thumbnail/${menu.thumbnail}" style="width:50px"></td>
              </tr>
                `

                number++
            })

            $('tbody').html(data)

        },
        error: (err) => {
            console.log(err)
        }
    })
}

const getCategory = () => {
    $.ajax({
        url: 'http://localhost:3000/data/jenis',
        success : (res) => {
            let data 
            res.forEach((categories) => {
                data += `
                    <option value="${categories.id}" data-id="${categories.id}">${categories.kategori}</option>
                `
            })

            $('#add-kategori').html(data)
            $('#edit-kategori').html(data)
        },
        error: (err) => {
            console.log(err)
        }
    })
}

const updateMenu = () => {
    $('#btn-edit-menu').on('click',()=>{
        const id_menu = document.querySelectorAll('.id-menu')
        let idSelected = []
        
        id_menu.forEach((id) => {
            if(id.checked){
                idSelected.push(id.getAttribute('data-id'))
            }
        })


        if(idSelected.length == 0){
            alert("tidak ada data yang di pilih")
        }else if(idSelected.length >1){
            alert("data yang dipilih lebih dari 1")
        }else if(idSelected.length == 1){

            $.ajax({
                url: `http://localhost:3000/data/menu/id/${idSelected[0]}`,
                success: (res) => {
                    let detail = res[0]
                    
                    $('#form-edit #nama').val(detail.nama)
                    $('#form-edit #stock').val(detail.stock)
                    $('#form-edit #harga').val(detail.harga)
                    $('#form-edit #id').val(detail.id)

                    let data_id;

                    const categories = document.querySelectorAll('#form-edit #edit-kategori option')
                    categories.forEach((categorie)=>{
                        data_id = categorie.getAttribute('data-id')

                        if(data_id == detail.id_jenis){
                          categorie.setAttribute("selected","")
                        }
                    })

                    $('#form-edit #foto_lama').val(detail.thumbnail)
                },
                error : (err) => {
                    console.log(err)
                }
            })

            $("#modalEditMenu").modal('show')
        }
       
    })
}

const deleteMenu = () => {
    $('#btn-delete-menu').on('click',() => {
        const id_menu = document.querySelectorAll('.id-menu')
        let idSelected = []
        
        id_menu.forEach((id) => {
            if(id.checked){
                idSelected.push(id.getAttribute('data-id'))
            }
        })


        if(idSelected.length == 0){
            alert("tidak ada data yang di pilih")
        }else if(idSelected.length >1){
            alert("data yang dipilih lebih dari 1")
        }else if(idSelected.length == 1){
            const isDelete = confirm("Apakah anda yakin ingin menghapus data ini ?")

            if(isDelete){
                $.ajax({
                    url : 'http://localhost:3000/manager/menu',
                    type: 'DELETE',
                    dataType: 'application/json',
                    data : {id:idSelected[0]},
                    success: (res) => {
                    },
                    error: (err) => {
                        console.log(err)
                    }
                })

                setTimeout(()=>{
                    alert("berhasil menghapus data")
                    getMenu()
                },1000)
            }
        }

    })
}

const convertCurrency = (money) => {
    let rupiah = '';		
	var angkarev = money.toString().split('').reverse().join('');
	for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
	return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
}
