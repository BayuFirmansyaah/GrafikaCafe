$(document).ready(function(){
    logs()
})

const logs = () => {
     // date from order
     const date = new Date()
     let tanggal = parseInt(date.getDate())
     let bulan = parseInt(date.getMonth())
     let tahun = parseInt(date.getFullYear())

     let url = `http://localhost:3000/data/log`; 

    $.ajax({
        url,
        success: (res) => {
            let list = ""
          
            let total = 0;
            res.forEach((log)=>{
                list += `
                <tr>
                    <td>${convertDate(log.time)}</td>
                    <td>${log.name}</td>
                    <td>${log.log}</td>
                </tr>
                `   
            })

            $('tbody').html(list);
        },
        error: (err) => {
            console.log(err)
        }
    })
}

const convertDate = (time) => {
    const milliseconds = (time)*1
    const dateObject = new Date(milliseconds)

    return dateObject.toLocaleString()
}
