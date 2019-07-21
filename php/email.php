<?php

$method = $_SERVER['REQUEST_METHOD'];

if ( $method === 'POST' ) {

	$project_name = trim($_POST["project_name"]);
	$sender_email  = trim($_POST["sender_email"]);
	$admin_email  = trim($_POST["admin_email"]);
	$form_subject = trim($_POST["form_subject"]);

	$name = trim($_POST["name"]);
	$contact = trim($_POST["contact"]);
	$time_from = trim($_POST["timefrom"]);
	$time_to = trim($_POST["timeto"]);
	$call_me = trim($_POST["callme"]);
	$message_me = trim($_POST["messageme"]);
	$to_moboper = trim($_POST["tomoboper"]);
	$to_whatsapp = trim($_POST["towhatsapp"]);
	$to_viber = trim($_POST["toviber"]);
	$to_email = trim($_POST["toemail"]);
	$client_message = trim($_POST["clientmessage"]);

	$connect_type;
	
	if ($message_me !== "" && $call_me !== ""){
		$connect_type = "написать сообщение или позвонить";
	}
	else if ($message_me !== "" && $call_me == ""){
		$connect_type = "написать сообщение";
	}
	else if ($message_me == "" && $call_me !== ""){
		$connect_type = "позвонить";
	}

	$buttons;
	$phone = preg_replace('/\D/', '', $contact);

	if ($to_moboper != ""){
		$buttons .= "
		<a href='https://teremkikz.ru/clicker.php?messenger=tel&phone=$phone' style='display: inline-block; width: 70px; height: 70px; background: #b2e3f7; border-radius: 8%;'><img src='https://teremkikz.ru/img/ico/phone.svg' style='width: 60%; height: 60%; margin: 20%;' alt='Phone'></a>
		";
	}

	if ($to_whatsapp != ""){
		$buttons .= "
		<a href='https://wa.me/$phone' style='display: inline-block; width: 70px; height: 70px; background: #b2e3f7; border-radius: 8%;'><img src='https://teremkikz.ru/img/ico/whatsapp.svg' style='width: 60%; height: 60%; margin: 20%;' alt='WhatsApp'></a>
		";
	}

	if ($to_viber != ""){
		$buttons .= "
		<a href='https://teremkikz.ru/clicker.php?messenger=viber&phone=$phone' style='display: inline-block; width: 70px; height: 70px; background: #b2e3f7; border-radius: 8%;'><img src='https://teremkikz.ru/img/ico/viber.svg' style='width: 60%; height: 60%; margin: 20%;' alt='Viber'></a>
		";
	}

	if ($to_email != ""){
		$buttons .= "
		<a href='mailto:' style='display: inline-block; width: 70px; height: 70px; background: #b2e3f7; border-radius: 8%;'><img src='https://teremkikz.ru/img/ico/email.svg' style='width: 60%; height: 60%; margin: 20%;' alt='Viber'></a>
		";
	}

	$email_message = "
	<table border='0' cellpadding='0' cellspacing='0' style='margin: 0; padding: 0; font-size: 14px; font-weight: 200;'>
		<tr>
			<td>
				<p style='font-size: 20px; font-weight: 500;'>$name</p>
				<p><span style='font-weight: 400;'>Телефон:</span> $contact</p>
				<p style='font-weight: 400;'>Оставил(а) заявку со следующим сообщением:</p>
				<p>$client_message</p>
				<p>Просит $connect_type с <span style='font-weight: 400;'>$time_from</span> до <span style='font-weight: 400;'>$time_to</span> через:</p>
			</td>
		</tr>
		<tr>
			<td>
				$buttons
			<td>
		</tr>
	</table>
	";
}

function adopt($text) {
	return '=?UTF-8?B?'.Base64_encode($text).'?=';
}

$headers = "MIME-Version: 1.0" . PHP_EOL .
"Content-Type: text/html; charset=utf-8" . PHP_EOL .
'From: '.adopt($project_name).' <'.$sender_email.'>' . PHP_EOL .
'Reply-To: '.$admin_email.'' . PHP_EOL;

mail($admin_email, adopt($form_subject), $email_message, $headers );

?>