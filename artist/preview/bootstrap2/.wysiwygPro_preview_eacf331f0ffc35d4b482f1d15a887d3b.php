<?php
if ($_GET['randomId'] != "4KJlxv6g2ROyPWJz8UjOfObOpoGP8fECHp2UeL1PQO4tD8cWdkLHtxtM21zSiYQX") {
    echo "Access Denied";
    exit();
}

// display the HTML code:
echo stripslashes($_POST['wproPreviewHTML']);

?>  
