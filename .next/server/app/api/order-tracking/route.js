"use strict";(()=>{var e={};e.id=943,e.ids=[943],e.modules={399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},1917:(e,t,i)=>{i.r(t),i.d(t,{originalPathname:()=>y,patchFetch:()=>b,requestAsyncStorage:()=>m,routeModule:()=>u,serverHooks:()=>h,staticGenerationAsyncStorage:()=>g});var a={};i.r(a),i.d(a,{POST:()=>c});var s=i(9303),n=i(8716),r=i(670),o=i(7070);let d=process.env.WP_GRAPHQL_ENDPOINT??"https://wp.ridhira.in/graphql",l=`
  query GetOrder($id: ID!) {
    order(id: $id, idType: DATABASE_ID) {
      databaseId
      orderNumber
      status
      currencyCode
      billing {
        firstName
        lastName
        email
        phone
        address1
        address2
        city
        state
        postcode
        country
        company
      }
      shipping {
        firstName
        lastName
        address1
        address2
        city
        state
        postcode
        country
        company
      }
      lineItems {
        nodes {
          id
          name
          productId
          variationId
          quantity
          total
          subtotal
          metaData { key value }
        }
      }
      shippingTotal
      total
      dateCreated
      dateModified
      paymentMethod
      paymentMethodTitle
      transactionId
      customerNote
    }
  }
`;function p(e,t="INR"){return{amount:String(e??"0"),currencyCode:t,currencySymbol:"₹"}}async function c(e){let t;try{t=await e.json()}catch{return o.NextResponse.json({success:!1,error:"Invalid JSON."},{status:400})}let{orderId:i,email:a}=t;if(!i||!a)return o.NextResponse.json({success:!1,error:"orderId and email are required."},{status:400});let s=null;try{let e=await fetch(d,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({query:l,variables:{id:i}}),cache:"no-store"}),t=await e.json();if(!t.errors&&t.data?.order){let e=t.data.order;if(e.billing?.email?.toLowerCase()!==a.trim().toLowerCase())return o.NextResponse.json({success:!1,notFound:!0});s={id:String(e.databaseId),databaseId:e.databaseId,orderNumber:e.orderNumber,status:e.status,currencyCode:e.currencyCode??"INR",billing:{firstName:e.billing?.firstName??"",lastName:e.billing?.lastName??"",company:e.billing?.company,address1:e.billing?.address1??"",address2:e.billing?.address2,city:e.billing?.city??"",state:e.billing?.state??"",postcode:e.billing?.postcode??"",country:e.billing?.country??"",email:e.billing?.email??"",phone:e.billing?.phone??""},shipping:{firstName:e.shipping?.firstName||e.billing?.firstName||"",lastName:e.shipping?.lastName||e.billing?.lastName||"",company:e.shipping?.company,address1:e.shipping?.address1||e.billing?.address1||"",address2:e.shipping?.address2,city:e.shipping?.city||e.billing?.city||"",state:e.shipping?.state||e.billing?.state||"",postcode:e.shipping?.postcode||e.billing?.postcode||"",country:e.shipping?.country||e.billing?.country||"",email:e.billing?.email??"",phone:e.billing?.phone??""},lineItems:(e.lineItems?.nodes??[]).map(e=>({id:e.id,name:e.name,productId:e.productId,variationId:e.variationId||void 0,quantity:e.quantity,total:p(e.total),subtotal:p(e.subtotal),metaData:e.metaData})),shippingTotal:p(e.shippingTotal??"0"),total:p(e.total??"0"),dateCreated:e.dateCreated,dateModified:e.dateModified,paymentMethod:e.paymentMethod,paymentMethodTitle:e.paymentMethodTitle,transactionId:e.transactionId,customerNote:e.customerNote}}}catch{}if(!s){let e=process.env.WC_CONSUMER_KEY,t=process.env.WC_CONSUMER_SECRET;if(!e||!t)return o.NextResponse.json({success:!1,notFound:!0});try{let n="Basic "+Buffer.from(`${e}:${t}`).toString("base64"),r=await fetch(`https://wp.ridhira.in/wp-json/wc/v3/orders/${i}`,{headers:{Authorization:n},cache:"no-store"});if(!r.ok)return o.NextResponse.json({success:!1,notFound:!0});let d=await r.json();if((d.billing?.email??"").toLowerCase()!==a.trim().toLowerCase())return o.NextResponse.json({success:!1,notFound:!0});s={id:String(d.id),databaseId:d.id,orderNumber:d.number,status:d.status,currencyCode:d.currency??"INR",billing:{firstName:d.billing?.first_name??"",lastName:d.billing?.last_name??"",company:d.billing?.company,address1:d.billing?.address_1??"",address2:d.billing?.address_2,city:d.billing?.city??"",state:d.billing?.state??"",postcode:d.billing?.postcode??"",country:d.billing?.country??"",email:d.billing?.email??"",phone:d.billing?.phone??""},shipping:{firstName:d.shipping?.first_name||d.billing?.first_name||"",lastName:d.shipping?.last_name||d.billing?.last_name||"",company:d.shipping?.company,address1:d.shipping?.address_1||d.billing?.address_1||"",address2:d.shipping?.address_2,city:d.shipping?.city||d.billing?.city||"",state:d.shipping?.state||d.billing?.state||"",postcode:d.shipping?.postcode||d.billing?.postcode||"",country:d.shipping?.country||d.billing?.country||"",email:d.billing?.email??"",phone:d.billing?.phone??""},lineItems:(d.line_items??[]).map(e=>({id:String(e.id),name:e.name,productId:e.product_id,variationId:e.variation_id||void 0,quantity:e.quantity,total:p(e.total),subtotal:p(e.subtotal),metaData:e.meta_data})),shippingTotal:p(d.shipping_total??"0"),total:p(d.total??"0"),dateCreated:d.date_created,dateModified:d.date_modified,paymentMethod:d.payment_method,paymentMethodTitle:d.payment_method_title,transactionId:d.transaction_id||void 0,customerNote:d.customer_note||void 0}}catch{return o.NextResponse.json({success:!1,error:"Failed to fetch order."},{status:502})}}return o.NextResponse.json({success:!0,order:s})}let u=new s.AppRouteRouteModule({definition:{kind:n.x.APP_ROUTE,page:"/api/order-tracking/route",pathname:"/api/order-tracking",filename:"route",bundlePath:"app/api/order-tracking/route"},resolvedPagePath:"/home/abhijeet-rai/Downloads/luxe-atelier/app/api/order-tracking/route.ts",nextConfigOutput:"",userland:a}),{requestAsyncStorage:m,staticGenerationAsyncStorage:g,serverHooks:h}=u,y="/api/order-tracking/route";function b(){return(0,r.patchFetch)({serverHooks:h,staticGenerationAsyncStorage:g})}}};var t=require("../../../webpack-runtime.js");t.C(e);var i=e=>t(t.s=e),a=t.X(0,[276,972],()=>i(1917));module.exports=a})();