import React from "react";
import Head from "next/head";
import Cookies from "js-cookie";

const StyleSheets = () => {
    const id  = process.env.NEXT_PUBLIC_HOTJAR_ID
    const sv  = process.env.NEXT_PUBLIC_HOTJAR_SV
    const name = Cookies.get('fullName')
    const roleID = Cookies.get('roleID')
  return(
  <Head>
    <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="format-detection" content="telephone=no" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    {/*<link rel="shortcut icon" href="/static/img/favi.png" />
        <link rel="icon" href="/static/img/favi.png" sizes="32x32" />
        <link rel="icon" href="/static/img/favi.png" sizes="192x192" />
        <link rel="apple-touch-icon-precomposed" href="/static/img/favi.png" />*/}
    <meta name="author" content="nouthemes" />
    <meta name="keywords" content="QistBazaar,Admin" />
    <meta name="description" content="QistBazaar - Admin" />
    <title>QistBazaar | Admin</title>
    <link
      href="https://fonts.googleapis.com/css?family=Work+Sans:300,400,500,600,700&amp;amp;subset=latin-ext"
      rel="stylesheet"
    />
    <link rel="stylesheet" href="/fonts/Linearicons/Font/demo-files/demo.css" />

    <link
      rel="stylesheet"
      href="/fonts/font-awesome/css/font-awesome.min.css"
    />
    <link rel="stylesheet" type="text/css" href="/css/bootstrap.min.css" />

    <script
            id="hotjar-init"
            strategy="afterInteractive"   // don’t block the main thread
            dangerouslySetInnerHTML={{
              __html: `
                (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:${id},hjsv:${sv}};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src='https://static.hotjar.com/c/hotjar-'+${id}+'.js?sv='+${sv};
                  a.appendChild(r);
                })(window,document);
              `,
            }}

            
    />
      {/* ✅ HOTJAR IDENTIFY CODE - Fixed variable interpolation */}
      <script
        id="hotjar-identify"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {              
              function identifyUser() {
                if (typeof window !== 'undefined' && window.hj) {
                  var userId = ${name ? `"${name}"` : 'null'};
                  
                  window.hj('identify', userId, {
                    'name': ${name ? `"${name.replace(/"/g, '\\"')}"` : 'null'},
                    'role_id': ${roleID ? `"${roleID}"` : 'null'},
                    'last_login': new Date().toISOString(),
                    'current_session': new Date().toISOString(),
                    'page_loaded': window.location.pathname
                  });
                  
                  console.log('Hotjar user identified:', userId);
                } else {
                  // Retry if Hotjar not loaded yet
                  setTimeout(identifyUser, 500);
                }
              }
              
              // Start identification after a short delay
              setTimeout(identifyUser, 1000);
            })();
          `,
        }}
      />
  </Head>
)};

export default StyleSheets;
