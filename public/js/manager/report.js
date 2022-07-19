$(document).ready(function(){
    report()
    kasirName()
})

const report = () => {
     // date from order
     const date = new Date()
     let tanggal = parseInt(date.getDate())
     let bulan = parseInt(date.getMonth())
     let tahun = parseInt(date.getFullYear())

     let url = `http://localhost:3000/data/report/daily/${tanggal}/${bulan+1}/${tahun}`; 

    $.ajax({
        url,
        success: (res) => {
            let list = ""
            let number = 1;
            let total = 0;
            res.forEach((report)=>{
                total = total + report.total
                list += `
                <tr>
                    <th scope="row">${number}</th>
                    <td>${report.name}</td>
                    <td>${report.tanggal}-${report.bulan}-${report.tahun}</td>
                    <td>${convertCurrency(report.total)}</td>
                </tr>
                `   
                number++
            })

            $('tbody').html(list);
            $('#pendapatan-hari-ini').html(convertCurrency(total))
        },
        error: (err) => {
            console.log(err)
        }
    })
}

const kasirName = () => {
    $.ajax({
        url:"http://localhost:3000/data/akun",
        success: (res) => {
            let list = ""

            res.forEach((kasir)=>{
                list += `
                    <option value="${kasir.id}">${kasir.name}</option>
                `
            })

            $("#kasir-filter").html(list)
            filter()
        },
        error: (err) => {
            console.log(err)
        }
    })
}

const filter = () => {
    $("#filter").on('click',function(){
       let id = $("#kasir-filter").find("option:selected").val()
       // date from order
        const date = new Date()
        let tanggal = parseInt(date.getDate())
        let bulan = parseInt(date.getMonth())
            bulan = convertMonth(bulan)
        let tahun = parseInt(date.getFullYear())

      let query = `
          SELECT * FROM pembayaran 
          INNER JOIN akun 
          ON pembayaran.id_akun = akun.id 
          WHERE 
            pembayaran.id_akun=${id} AND 
            pembayaran.tanggal=${tanggal} AND 
            pembayaran.bulan='${bulan}' AND 
            pembayaran.tahun=${tahun} 
          ORDER BY pembayaran.id DESC 
          `

      $.ajax({
          url: "http://localhost:3000/data/join/",
          type: "POST",
          dataType: "application/json",
          data: {query},
          success: (res) => {
              console.log(res)
          },
          error: (err) => {
            let res = JSON.parse(err.responseText)
            let list = ""
            let number = 1;
            res.forEach((report)=>{
                list += `
                <tr>
                    <th scope="row">${number}</th>
                    <td>${report.name}</td>
                    <td>${report.tanggal}-${report.bulan}-${report.tahun}</td>
                    <td>${convertCurrency(report.total)}</td>
                </tr>
                `   
                number++
            })

            $('tbody').html(list);
          }
      })
    })
}

const convertMonth = (month) => {
    switch(month){
        case 0:
            return "Januari"
            break
        case 1:
            return "Febuari"
            break
        case 2:
            return "Maret"
            break
        case 3:
            return "April"
            break
        case 4:
            return "Mei"
            break
        case 5:
            return "Juni"
            break
        case 6:
            return "Juli"
            break
        case 7:
            return "Agustus"
            break
        case 8:
            return "September"
            break
        case 9:
            return "Oktober"
            break
        case 10: 
            return "November"
            break 
        case 11:
            return "Desember"
            break
    }
}

const convertCurrency = (money) => {
    let rupiah = '';		
	var angkarev = money.toString().split('').reverse().join('');
	for(var i = 0; i < angkarev.length; i++) if(i%3 == 0) rupiah += angkarev.substr(i,3)+'.';
	return 'Rp. '+rupiah.split('',rupiah.length-1).reverse().join('');
}