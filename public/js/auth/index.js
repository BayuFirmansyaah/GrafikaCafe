$('#login').submit(function(e){
    e.preventDefault()

    const data = {
        username : this.username.value,
        password : this.password.value
    }

    $.ajax({
        url:'http://localhost:3000/auth',
        type: 'POST',
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        success: (data) => {
            const path = document.location.href + data.path
            
            $('#notif').html(
                `
                <div class="alert alert-success alert-dismissible fade show mt-5" role="alert" >
                    Berhasil Melakukan Login,anda akan diarahkan dalam 3 detik
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `
            )

            setTimeout(()=>{
                document.location.href = "/kasir"
            },3000)
        },
        error: (err) =>{
            console.log(err)
            $('#notif').html(
                `
                <div class="alert alert-warning alert-dismissible fade show mt-5" role="alert" >
                    ${err.responseJSON.message}
                    <button type="button" class="close" data-dismiss="alert" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                `
            )
        }
    })

})