<!DOCTYPE html>

<?php $browser = ""; ?>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">
<head>
    <title>A day, divided.</title>
    <meta http-equiv="Content-Type" content="text/html;charset=utf-8"/>
    <?php
    if ($browser == "mobile") {
            // Assert: we need the meta viewport tag and the mobile CSS file.  ?>
            <meta name="viewport" content="width=device-width,
            minimum-scale=1.0, maximum-scale=1.0"/>
            <!--
            <link rel="stylesheet" type="text/css" href="/css/mobile.css"/>
            -->
    <? } else {
            // Assert: not iOS or Android.  Use the regular CSS. ?>
            <!--
            <link rel="stylesheet" type="text/css" href="/css/nonmobile.css"/>
            -->
    <? } ?>
    <meta name="robots" content="nofollow"/>
    <meta name="author" content="Andrew Hallagan"/>
    <meta name="description" content="A bar char of time spent doing different things."/>
    <script type="text/javascript" src="/js/lib/jquery.js"></script>
    <script type="text/javascript" src="/js/lib/jquery-ui.js"></script>
    <script type="text/javascript" src="/js/lib/underscore.js"></script>
    <script type="text/javascript" src="/js/lib/json2.js"></script>
    <script type="text/javascript" src="/js/lib/backbone.js"></script>
    <script type="text/javascript" src="/js/lib/deep-model.js"></script>
    <script type="text/javascript" src="/js/lib/sprintf.js"></script>

    <script type="text/javascript" src="/js/EventTree.js"></script>
</head>

<body>

<ul>
    <li data-label="sleep">Sleep</li>
</ul>

</body>
</html>
