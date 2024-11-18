function QRCodesSet(){
	let elements = document.querySelectorAll('.qrcodeElement');
	elements.forEach(element => {

		const link = element.getAttribute("data-link");
		const elID = element.getAttribute("id");
		new QRCode(elID, link);
	});
}


document.addEventListener("DOMContentLoaded", function(){	
	QRCodesSet();
});