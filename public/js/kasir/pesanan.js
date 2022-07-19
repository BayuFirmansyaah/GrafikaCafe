$(document).ready(function(){
    getMenu()
    createOrder()
    cancelOrder()
    showButton()
    getListOrder()
    checkout()
    completedOrder()
})

const getMenu = () => {
    $.ajax({
        url: 'http://localhost:3000/data/menu',
        success : (res) => {
            let number = 1
            let data = ""
            let currency
            let index = 0

            res.forEach((menu) => {
                // convert money
                currency = convertCurrency(menu.harga)

                data += `
                <div class="col-lg-3 menu-list-card">
                    <div class="card">
                        <img src="/img/thumbnail/${menu.thumbnail}" class="card-img-top" style="height:200px;" alt="...">
                        <div class="card-body">
                        <h5 class="card-title">${menu.nama}</h5>
                        <p class="card-text">${currency}</p>
                        <div>
                            <input type="text" class="jumlah" style="width:55%;float:left;height:40px;margin-right:5%;text-align:center">  
                            <button href="#" class="btn btn-primary order" style="float:left;height:40%;border-radius:0px;" data-id="${menu.id}" data-index="${index}">Tambah</button>
                        </div>
                        </div>
                    </div>
                </div>
                `
                number++
                index++
            })
            $('#data-menu').html(data)
            order()
        },
        error: (err) => {
            console.log(err)
        }
    })
}

const order = () => {
    let btn_order = document.querySelectorAll('.order')

    btn_order.forEach((order)=>{
       order.addEventListener('click',async function(){     
           let jumlah = await getJumlah(this.getAttribute('data-index'))
           let id_menu = this.getAttribute('data-id')
           let id_pembayaran = localStorage.getItem('id_payment')
           let id_meja = location.href
               id_meja = id_meja.replace("http://localhost:3000/kasir/meja/pesanan/","")
               id_meja = parseInt(id_meja)

           $.ajax({
               url: "http://localhost:3000/kasir/order/menu",
               type: "post",
               dataType: "application:json",
               data: {id_pembayaran,id_meja,id_menu,jumlah,catatan:""},
               success: (res) => {
                   
               },
               error: (err) => {
                alert("berhasil menambahkan pesanan")
                getListOrder()
                clear(this.getAttribute('data-index'))
               }
           })
        })

    })
}

const getJumlah = (index) => {
    let jumlah = document.querySelectorAll('.jumlah')[index]
    return jumlah.value
}

const clear = (index) =>{
    let jumlah = document.querySelectorAll('.jumlah')[index]
    jumlah.value = ""
}

// create order
const createOrder = () => {
    $('#btn-create-order').on('click',()=>{
        $.ajax({
            url: "http://localhost:3000/kasir/create/payment",
            type: "POST",
            success: (res) => {
                localStorage.setItem("id_payment",res.result.id)
                showButton()
            },
            error: (err) => {
                console.log(err)
            }
        })
    })
}

// show button order
const showButton = () => {
    let id_payment = localStorage.getItem('id_payment')
    getListOrder()
    
    if(id_payment !== null){
        const id_payment_length = id_payment.length
        
        if(id_payment >0){
            $('#btn-create-order').addClass('d-none')
            $('#btn-cancel-order').removeClass('d-none')
        }else{
            $('#btn-create-order').removeClass('d-none')
            $('#btn-cancel-order').addClass('d-none')
        }
    }else{
        $('#btn-create-order').removeClass('d-none')
        $('#btn-cancel-order').addClass('d-none')
    }

}

// cancel order
const cancelOrder = () => {
    $('#btn-cancel-order').on('click',()=>{
        let id = localStorage.getItem("id_payment")
        $.ajax({
            url: "http://localhost:3000/kasir/cancel/payment",
            type: "DELETE",
            dataType: "application/json",
            data: {id},
            success: (res) => {
            },
            error: (err) => {
              
            }
        })

        setTimeout(() => {
            localStorage.removeItem('id_payment')
            showButton()
            location.reload(true)
        }, 500)
    })
}

const getListOrder = () => {
    const id_payment = localStorage.getItem('id_payment')
    
    if(id_payment !== null){
        const id_payment_length = id_payment.length
        
        if(id_payment_length>0){
            let query = {
                query : "SELECT * FROM menu INNER JOIN pesanan ON menu.id = pesanan.id_menu WHERE pesanan.id_pembayaran="+id_payment
            }
        
            $.ajax({
                url: "http://localhost:3000/data/join/",
                type: "post",
                dataType: "application/json",
                data : query,
                success: (res) => {
                    console.log(res.status)
                },
                error: (err) => {
                    const data = JSON.parse(err.responseText)
                    let listing = ""
                    let currency;
                    let total = 0

                    data.forEach((menu)=>{
                        currency = convertCurrency(menu.total);
                        total = total + menu.total
                        
                        listing += `
                        <div class="list-menu">
                            <div class="list-item">
                            <div class="wrap-img" style="float:left;">
                                <img src="/img/thumbnail/${menu.thumbnail}" alt="" style="width:80px;">
                            </div>
                            <div class="wrap-detail-order">
                                <h5 class="f-nunito-6">${menu.nama} - ${menu.jumlah}</h5>
                                <h5 class="f-nunito-5">${currency}</h5>
                                <div style="float:right;margin-top:-80px;cursor:pointer;" class="remove-menu" data-id="${menu.id}">X</div>
                            </div>
                            </div>
                        </div>
                        `
                    })

                    $('#total-count').html(`Total : ${convertCurrency(total)}`)
                    $('#input-total-count').val(convertCurrency(total))
                    $('#listed-menu').html(listing)
                    removeMenu()
                }
            })
        }
    }

}

const checkout = () => {
    $('#btn-checkout').on('click',function(){
        $('#staticBackdrop').modal('hide')
        $('#checkout').modal('show')
    })
}

const completedOrder = () => {
    $('#completed-order').on('click',function(){
        let id_pembayaran = localStorage.getItem('id_payment')
        let bayar = parseInt($('#jumlah-bayar').val())
        let data = {id_pembayaran,bayar}
       
        $.ajax({
            url: "http://localhost:3000/kasir/checkout/order",
            type: "POST",
            dataType: "application/json",
            data,
            success: (res) => {
                // console.log(res)
            },
            error: (err) => {
                // console.log(err)
                let data = JSON.parse(err.responseText)
                alert("pesanan berhasil dilakukan")
                alert(`Jumlah Kembalian :R${convertCurrency(data.kembalian)}`)
                localStorage.removeItem('id_payment')
                location.reload(true)
            }
        })
    })
}

const removeMenu = () => {
    let menu = document.querySelectorAll('.remove-menu')

    menu.forEach((remove)=>{
        remove.addEventListener('click',function(){
            let id = parseInt(this.getAttribute("data-id"))

            $.ajax({
                url: "http://localhost:3000/kasir/order/menu",
                type: "DELETE",
                dataType: "application/json",
                data: {id},
                success: (res) => {
                    getListOrder()
                },
                error: (err) => {
                    getListOrder()
                }
            })
        })
    })
}

const convertCurrency = (money) => {
    let rupiah = '';		
	var angkarev = money.toString().split('').reverse().join('');
	for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
	return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
}