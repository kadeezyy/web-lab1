<?php
session_start();

$time_start = microtime(true);

$x = $_GET['x'];
$y = $_GET['y'];
$r = $_GET['r'];
$ycor = sprintf("%01.3f", $y);
$offset = $_GET['offset'];

function validateOffset($offset){
    return (is_numeric($offset));
}

function validateX($x){
    return (is_numeric($x) && ($x == -3 || $x == -2 || $x == -1 || $x == 0 || $x == 1 || $x == 2 || $x == 3 || $x == 4 || $x == 5));
}

function validateY($y){
    return is_numeric($y) && $y <= 5 && $y >= -5;
}

function validateR($r){
    return is_numeric($r) && ($r == 1 || $r == 1.5 || $r == 2 || $r == 2.5 || $r == 3);
}

function check_circle($x, $y, $r){
    return ($x <= 0 && $x >= -$r && $y <= $r && $y >= 0 && (pow($x, 2) + pow($y, 2) <= pow($r, 2)));
}

function check_rectangle($x, $y, $r){
    return ($x >= -$r && $x <= 0 && $y >= -$r/2 && $y <= 0);
}

function check_triangle($x, $y, $r){
    return ($x >= 0 && $x <= $r/2 && $y <= 0 && $y >= -$r);
}

function result($x, $y, $r){
    return check_circle($x, $y, $r) || check_rectangle($x, $y, $r) || check_triangle($x, $y, $r);
}

$result = (validateY($ycor) && validateX($x) && validateR($r) && validateOffset($offset)) ? (result($x, $y, $r) ? 'Попадание' : 'Промах') : 'value error';
$time_end = microtime(true);
$script_time = number_format($time_end - $time_start, 6, ',', '');
$response = array('x' => $x, 'y' => $ycor, 'r' => $r, 'now' => date('j M o G:i:s', time() - $offset * 60), 'script_time' => $script_time, 'result' => $result);
array_push($_SESSION["data"], $response);

if (!isset($_SESSION['data'])) {
    $_SESSION['data'] = array();
}
foreach ($_SESSION["data"] as $elem){
    echo '<tr>';
    echo '<td>' . $elem['now'] . '</td>';
    echo '<td>' . $elem['script_time'] . '</td>';
    echo '<td>' . $elem['x'] . '</td>';
    echo '<td>' . $elem['y'] . '</td>';
    echo '<td>' . $elem['r'] . '</td>';
    echo '<td>' . $elem['result'] . '</td>';
    echo'</tr>';
}
?>