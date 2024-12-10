function QRCodesSet(){
	let elements = document.querySelectorAll('.qrcodeElement');
	elements.forEach(element => {

		const link = element.getAttribute("data-link");
		const size = element.getAttribute("data-size");

		let pxSize = 250; //default size
		if(size == "small"){
			pxSize = 100;
		} else if(size == "medium"){
			pxSize = 250;
		} else if(size == "large"){
			pxSize = 500;
		}
		
		//Create QR Code
		var qrcode = new QRCode(element, {
			text: link,
			width: pxSize,
			height: pxSize,
			colorDark : "#000000",
			colorLight : "#ffffff",
			correctLevel : QRCode.CorrectLevel.H
		});
	});
}


document.addEventListener("DOMContentLoaded", function(){	
	QRCodesSet();
});