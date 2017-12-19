/*
This example shows a simple application that retrieves Ledger data from AccountView.
- Authorize: The user has to give permission for the app to use AccountView Data.
  The Authorize URL is based on the given data and needs to be entered in a browser.
- Retrieve Token: A grant code is added to the redirect URL, which can be traded for an access token.
- Request company: Once the access token has been received, we request the companies that are connected to the user.
- Perform API request: When a company is selected and an API get request has been entered, we can executed the API call.

For more information about the WEB API procedure, visit the developer documentation in accountview.net.
*/

$(document).ready(function() {
	//var baseURL = "https://localhost:2501/";
	var baseURL = "https://accountview.net/";
	var authorizationURL = '';
	//Constructs the authorization URL. This URL needs to be executed in a browser.
	function GetData(){
  		return $("#iFrameTarget").html();
	}
	$("#GetAuthorizationURLButton").click(function () {
		var key = $('#apiKey').val();
		var secret = $('#apiSecret').val();
		// var redirectURL = $('#redirectURL').val(); 
		var redirectURL = 'http://billing.thgroep.nl/api/accountview/'
		redirectURL = encodeURIComponent(redirectURL); //Redirect URL needs to be URL encoded
		
		authorizationURL = baseURL + "ams/authorize.aspx" +
							"?response_type=code" +
							"&client_id=" + key +
							"&redirect_uri=" + redirectURL +
							"&scope=readaccountviewdata";					
		//$('#authorizationLink').attr('href', authorizationURL);
		//$('#validateValue').html('Please Connect');
		$('#iFrameTarget').attr('src',authorizationURL);
		console.log(authorizationURL);
		//$('#authorizationLink').html(authorizationURL);
	});
	//console.log(document.getElementById('iFrameTarget').contentWindow.document.body.innerHTML);


	
	//Retrieves a token via an AJAX call and places the result on screen.
	$("#retrieveTokenButton").click(function () {
		var redirectURL = $('#redirectURL').val();
		var key = $('#apiKey').val();
		var secret = $('#apiSecret').val();
		var codegrant = $('#codegrant').val();
		codegrant = decodeURIComponent(codegrant); //Code grant needs to be URL decoded
		
		$.ajax({
			type: 'POST',
			url: baseURL + "api/v3/token",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			data: {
				grant_type: 'authorization_code',
				code: codegrant,
				redirect_uri: redirectURL,
				client_id: key,
				client_secret: secret
			},
		}).done(function (data) {
			$('#token').html(data.access_token);
			GetCompanies();
		}).fail(function (data, textStatus) {
			alert(JSON.stringify(data));
		});
	});
	
	//Retrieve companies and place them in a dropdown list
	function GetCompanies(){
		var token = $('#token').html();
		
		$.ajax({
			type: 'GET',
			url: baseURL + "api/v3/Companies",
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			beforeSend: function (jqXHR) {
				jqXHR.setRequestHeader("Authorization", "Bearer " + token);
			}
		}).done(function (data) {
			//add comapnies to dropdown
			for (var i = 0; i < data.length; i++) { 
				$('#companyID')
					.append($("<option></option>")
					.attr("value",data[i].Id)
					.text(data[i].Description)); 
			}
		}).fail(function (data, textStatus){
			alert(JSON.stringify(data));
		});	
	}
	
	//Perform the API request
	$("#executeRquest").click(function () {
		var requestURL = $('#requestURL').val();
		var companyId = $('#companyID').val();
		var token = $('#token').html();
		
		$.ajax({
			type: 'GET',
			url: requestURL,
			contentType: "application/x-www-form-urlencoded; charset=UTF-8",
			beforeSend: function (jqXHR) {
				jqXHR.setRequestHeader("Authorization", "Bearer " + token);
				jqXHR.setRequestHeader("x-company", companyId);
			}
		}).done(function (data) {
			$('#result').html(JSON.stringify(data, undefined, 2));
		}).fail(function (data, textStatus){
			alert(JSON.stringify(data));
		});	
	});
});