"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[571],{7485:function(e,t,i){i.d(t,{g4:function(){return c}});var a=i(7437);i(2265);var r=i(2100);let s="#4fa94d",n={"aria-busy":!0,role:"progressbar"},o=(0,r.ZP).div`
  display: ${e=>e.$visible?"flex":"none"};
`,l=(0,r.F4)`
12.5% {
  stroke-dasharray: ${33.98873199462888}px, ${242.776657104492}px;
  stroke-dashoffset: -${26.70543228149412}px;
}
43.75% {
  stroke-dasharray: ${84.97182998657219}px, ${242.776657104492}px;
  stroke-dashoffset: -${84.97182998657219}px;
}
100% {
  stroke-dasharray: ${2.42776657104492}px, ${242.776657104492}px;
  stroke-dashoffset: -${240.34889053344708}px;
}
`;(0,r.ZP).path`
  stroke-dasharray: ${2.42776657104492}px, ${242.776657104492};
  stroke-dashoffset: 0;
  animation: ${l} ${1.6}s linear infinite;
`;let d=(0,r.F4)`
to {
   transform: rotate(360deg);
 }
`;(0,r.ZP).svg`
  animation: ${d} 0.75s steps(12, end) infinite;
  animation-duration: 0.75s;
`,(0,r.ZP).polyline`
  stroke-width: ${e=>e.width}px;
  stroke-linecap: round;

  &:nth-child(12n + 0) {
    stroke-opacity: 0.08;
  }

  &:nth-child(12n + 1) {
    stroke-opacity: 0.17;
  }

  &:nth-child(12n + 2) {
    stroke-opacity: 0.25;
  }

  &:nth-child(12n + 3) {
    stroke-opacity: 0.33;
  }

  &:nth-child(12n + 4) {
    stroke-opacity: 0.42;
  }

  &:nth-child(12n + 5) {
    stroke-opacity: 0.5;
  }

  &:nth-child(12n + 6) {
    stroke-opacity: 0.58;
  }

  &:nth-child(12n + 7) {
    stroke-opacity: 0.66;
  }

  &:nth-child(12n + 8) {
    stroke-opacity: 0.75;
  }

  &:nth-child(12n + 9) {
    stroke-opacity: 0.83;
  }

  &:nth-child(12n + 11) {
    stroke-opacity: 0.92;
  }
`;let c=({height:e=80,width:t=80,radius:i=9,color:r=s,ariaLabel:l="three-dots-loading",wrapperStyle:d,wrapperClass:c,visible:h=!0})=>(0,a.jsx)(o,{style:d,$visible:h,className:c,"data-testid":"three-dots-loading","aria-label":l,...n,children:(0,a.jsxs)("svg",{width:t,height:e,viewBox:"0 0 120 30",xmlns:"http://www.w3.org/2000/svg",fill:r,"data-testid":"three-dots-svg",children:[(0,a.jsxs)("circle",{cx:"15",cy:"15",r:Number(i)+6,children:[(0,a.jsx)("animate",{attributeName:"r",from:"15",to:"15",begin:"0s",dur:"0.8s",values:"15;9;15",calcMode:"linear",repeatCount:"indefinite"}),(0,a.jsx)("animate",{attributeName:"fill-opacity",from:"1",to:"1",begin:"0s",dur:"0.8s",values:"1;.5;1",calcMode:"linear",repeatCount:"indefinite"})]}),(0,a.jsxs)("circle",{cx:"60",cy:"15",r:i,attributeName:"fill-opacity",from:"1",to:"0.3",children:[(0,a.jsx)("animate",{attributeName:"r",from:"9",to:"9",begin:"0s",dur:"0.8s",values:"9;15;9",calcMode:"linear",repeatCount:"indefinite"}),(0,a.jsx)("animate",{attributeName:"fill-opacity",from:"0.5",to:"0.5",begin:"0s",dur:"0.8s",values:".5;1;.5",calcMode:"linear",repeatCount:"indefinite"})]}),(0,a.jsxs)("circle",{cx:"105",cy:"15",r:Number(i)+6,children:[(0,a.jsx)("animate",{attributeName:"r",from:"15",to:"15",begin:"0s",dur:"0.8s",values:"15;9;15",calcMode:"linear",repeatCount:"indefinite"}),(0,a.jsx)("animate",{attributeName:"fill-opacity",from:"1",to:"1",begin:"0s",dur:"0.8s",values:"1;.5;1",calcMode:"linear",repeatCount:"indefinite"})]})]})}),h=(0,r.F4)`
to {
   stroke-dashoffset: 136;
 }
`;(0,r.ZP).polygon`
  stroke-dasharray: 17;
  animation: ${h} 2.5s cubic-bezier(0.35, 0.04, 0.63, 0.95) infinite;
`,(0,r.ZP).svg`
  transform-origin: 50% 65%;
`}}]);