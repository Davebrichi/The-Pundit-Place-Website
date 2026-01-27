<?php
mail(
  "consult@thepunditplace.com",
  "Mail Test",
  "If you received this, PHP mail works.",
  "From: no-reply@thepunditplace.com"
);
echo "Sent";
