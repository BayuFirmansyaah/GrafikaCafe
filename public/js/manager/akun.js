$(document).ready(function(){
    getAkun()
    hapusAkun()
    updateAkun()
})

const getAkun = () =>{
    $.ajax({
        url: "http://localhost:3000/data/akun",
        success: (res) => {
            let number = 1;
            let list = ""

            res.forEach((akun)=>{
                list += `
                    <tr>
                        <td>${number}</td>
                        <td width="30px">
                            <input type="checkbox" class="id-akun" data-id=${akun.id} style="margin:0px 10px">
                        </td>
                        <td>${akun.username}</td>
                        <td>${akun.name}</td>
                        <td>${generateRole(akun.role)}</td>
                    </tr>
                    `
                number++
            })

            $('tbody').html(list)
        },
        error: (err) => {
            console.log(err)
        }
    })
}

const formAdd = document.querySelector("#form-tambah")
formAdd.addEventListener('submit',function(e){
    e.preventDefault()
    const username = formAdd.t_username.value
    const password = formAdd.t_password.value
    const repeat_password = formAdd.t_r_password.value
    const name = formAdd.t_name.value
    const role = formAdd.t_role.value

    const data = {username, password, repeat_password, name, role}

    $.ajax({
        url:"http://localhost:3000/admin/account",
        type: "POST",
        dataType: "application/json",
        data,
        success: (res) => {
            console.log(res)
        },
        error: (err) => {
            let message = JSON.parse(err.responseText)
            alert(message.message)
            location.reload(true)
        }
    })
})

const updateAkun = () => {
    $("#edit-akun").on('click',function(){
        const id_menu = document.querySelectorAll('.id-akun')
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
                url: `http://localhost:3000/data/akun/id/${idSelected[0]}`,
                success: (res) => {
                    let detail = res[0]
                    
                    $('#form-edit #u_username').val(detail.username)
                    $('#form-edit #u_name').val(detail.name)
                 
                    let data_id;

                    const categories = document.querySelectorAll('#form-edit #u_role option')
                    categories.forEach((categorie)=>{
                        data_id = categorie.getAttribute('data-id')

                        if(data_id == detail.id_jenis){
                          categorie.setAttribute("selected","")
                        }
                    })

                },
                error : (err) => {
                    console.log(err)
                }
            })

            $("#modalEditAkun").modal('show')
            executeUpdate(idSelected[0])
        }
    })
}

const executeUpdate = (id) => {
    const formEdit = document.querySelector("#form-edit")
    formEdit.addEventListener('submit',function(e){
    e.preventDefault()
    const username = formEdit.u_username.value
    const password = formEdit.u_password.value
    const repeat_password = formEdit.u_r_password.value
    const name = formEdit.u_name.value
    const role = formEdit.u_role.value
    
    const data = {id,username, password, repeat_password, name, role}

    $.ajax({
        url:"http://localhost:3000/admin/account",
        type: "PUT",
        dataType: "application/json",
        data,
        success: (res) => {
            console.log(res)
        },
        error: (err) => {
            let message = JSON.parse(err.responseText)
            alert(message.message)
            location.reload(true)
        }
    })
})
}

const hapusAkun = () => {
    $("#hapus-akun").on('click',function(){
        const id_menu = document.querySelectorAll('.id-akun')
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
                    url : 'http://localhost:3000/admin/account',
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
                    getAkun()
                },1000)
            }
        }
    })
}

const generateRole = (role) => {
    if(role == 1){
        return "Manager"
    }else if(role == 2){
        return "Admin"
    }else{
        return "Kasir"
    }
}