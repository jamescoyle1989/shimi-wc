import{r as g,M as b}from"./index-e33fe827.js";import{u as c}from"./index-14716adc.js";import"./iframe-55146820.js";import"../sb-preview/runtime.js";import"./_commonjsHelpers-725317a4.js";import"./index-d37d4223.js";import"./index-d38538b0.js";import"./index-356e4a49.js";var h={exports:{}},n={};/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var x=g,u=Symbol.for("react.element"),f=Symbol.for("react.fragment"),j=Object.prototype.hasOwnProperty,w=x.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,y={key:!0,ref:!0,__self:!0,__source:!0};function p(t,s,l){var i,r={},a=null,d=null;l!==void 0&&(a=""+l),s.key!==void 0&&(a=""+s.key),s.ref!==void 0&&(d=s.ref);for(i in s)j.call(s,i)&&!y.hasOwnProperty(i)&&(r[i]=s[i]);if(t&&t.defaultProps)for(i in s=t.defaultProps,s)r[i]===void 0&&(r[i]=s[i]);return{$$typeof:u,type:t,key:a,ref:d,props:r,_owner:w.current}}n.Fragment=f;n.jsx=p;n.jsxs=p;h.exports=n;var e=h.exports;const v=""+new URL("github-cdfc3270.svg",import.meta.url).href,k=""+new URL("discord-f7d1b78c.svg",import.meta.url).href,N=""+new URL("youtube-9f26eb0b.svg",import.meta.url).href,_=""+new URL("tutorials-adff6365.svg",import.meta.url).href,L=""+new URL("docs-5b0c7100.png",import.meta.url).href,R=""+new URL("share-b59d6c77.png",import.meta.url).href,S=""+new URL("figma-plugin-b0a5ad2d.png",import.meta.url).href,U=""+new URL("testing-6a59f681.png",import.meta.url).href,A=""+new URL("accessibility-cd6d60f7.png",import.meta.url).href,E=""+new URL("theming-b6e819c3.png",import.meta.url).href,T=""+new URL("addon-library-bc7ba705.png",import.meta.url).href,o=()=>{const t=Object.assign({svg:"svg",path:"path"},c());return e.jsx(t.svg,{viewBox:"0 0 14 14",width:"8px",height:"14px",style:{marginLeft:"4px",display:"inline-block",shapeRendering:"inherit",verticalAlign:"middle",fill:"currentColor","path fill":"currentColor"},children:e.jsx(t.path,{d:"m11.1 7.35-5.5 5.5a.5.5 0 0 1-.7-.7L10.04 7 4.9 1.85a.5.5 0 1 1 .7-.7l5.5 5.5c.2.2.2.5 0 .7Z"})})};function m(t){const s=Object.assign({h1:"h1",p:"p"},c(),t.components);return e.jsxs(e.Fragment,{children:[e.jsx(b,{title:"Welcome to Shimi-wc stories"}),`
`,e.jsx("div",{className:"sb-container",children:e.jsxs("div",{className:"sb-section-title",children:[e.jsx(s.h1,{id:"welcome-to-shimi-wc-stories",children:"Welcome to Shimi-wc stories"}),e.jsx(s.p,{children:"This site can be used for individually testing shimi-wc components in a number of different states, as well as providing some helpful documentation for each component."}),e.jsx(s.p,{children:"To get started, click on any of the components in the sidebar to get an overview of it with documentation of the various properties it supports."}),e.jsx(s.p,{children:"If you want to dive into one of the components in a particular state, you can click on one of the stories of that component to be able to play around with editing its property values."})]})}),`
`,e.jsxs("div",{className:"sb-container",children:[e.jsxs("div",{className:"sb-section-title",children:[e.jsx(s.h1,{id:"do-more-with-storybook",children:"Do more with Storybook"}),e.jsx(s.p,{children:"Now that you know the basics, let's explore other parts of Storybook that will improve your experience. This list is just to get you started. You can customise Storybook in many ways to fit your needs."})]}),e.jsx("div",{className:"sb-section",children:e.jsxs("div",{className:"sb-features-grid",children:[e.jsxs("div",{className:"sb-grid-item",children:[e.jsx("img",{src:L,alt:"A screenshot showing the autodocs tag being set, pointing a docs page being generated"}),e.jsx("h4",{className:"sb-section-item-heading",children:"Autodocs"}),e.jsx("p",{className:"sb-section-item-paragraph",children:`Auto-generate living,
interactive reference documentation from your components and stories.`}),e.jsxs("a",{href:"https://storybook.js.org/docs/web-components/writing-docs/autodocs",target:"_blank",children:["Learn more",e.jsx(o,{})]})]}),e.jsxs("div",{className:"sb-grid-item",children:[e.jsx("img",{src:R,alt:"A browser window showing a Storybook being published to a chromatic.com URL"}),e.jsx("h4",{className:"sb-section-item-heading",children:"Publish to Chromatic"}),e.jsx("p",{className:"sb-section-item-paragraph",children:"Publish your Storybook to review and collaborate with your entire team."}),e.jsxs("a",{href:"https://storybook.js.org/docs/web-components/sharing/publish-storybook#publish-storybook-with-chromatic",target:"_blank",children:["Learn more",e.jsx(o,{})]})]}),e.jsxs("div",{className:"sb-grid-item",children:[e.jsx("img",{src:S,alt:"Windows showing the Storybook plugin in Figma"}),e.jsx("h4",{className:"sb-section-item-heading",children:"Figma Plugin"}),e.jsx("p",{className:"sb-section-item-paragraph",children:`Embed your stories into Figma to cross-reference the design and live
implementation in one place.`}),e.jsxs("a",{href:"https://storybook.js.org/docs/web-components/sharing/design-integrations#embed-storybook-in-figma-with-the-plugin",target:"_blank",children:["Learn more",e.jsx(o,{})]})]}),e.jsxs("div",{className:"sb-grid-item",children:[e.jsx("img",{src:U,alt:"Screenshot of tests passing and failing"}),e.jsx("h4",{className:"sb-section-item-heading",children:"Testing"}),e.jsx("p",{className:"sb-section-item-paragraph",children:`Use stories to test a component in all its variations, no matter how
complex.`}),e.jsxs("a",{href:"https://storybook.js.org/docs/web-components/writing-tests/introduction",target:"_blank",children:["Learn more",e.jsx(o,{})]})]}),e.jsxs("div",{className:"sb-grid-item",children:[e.jsx("img",{src:A,alt:"Screenshot of accessibility tests passing and failing"}),e.jsx("h4",{className:"sb-section-item-heading",children:"Accessibility"}),e.jsx("p",{className:"sb-section-item-paragraph",children:"Automatically test your components for a11y issues as you develop."}),e.jsxs("a",{href:"https://storybook.js.org/docs/web-components/writing-tests/accessibility-testing",target:"_blank",children:["Learn more",e.jsx(o,{})]})]}),e.jsxs("div",{className:"sb-grid-item",children:[e.jsx("img",{src:E,alt:"Screenshot of Storybook in light and dark mode"}),e.jsx("h4",{className:"sb-section-item-heading",children:"Theming"}),e.jsx("p",{className:"sb-section-item-paragraph",children:"Theme Storybook's UI to personalize it to your project."}),e.jsxs("a",{href:"https://storybook.js.org/docs/web-components/configure/theming",target:"_blank",children:["Learn more",e.jsx(o,{})]})]})]})})]}),`
`,e.jsxs("div",{className:"sb-addon",children:[e.jsxs("div",{className:"sb-addon-text",children:[e.jsx("h4",{children:"Addons"}),e.jsx("p",{className:"sb-section-item-paragraph",children:"Integrate your tools with Storybook to connect workflows."}),e.jsxs("a",{href:"https://storybook.js.org/integrations/",target:"_blank",children:["Discover all addons",e.jsx(o,{})]})]}),e.jsx("div",{className:"sb-addon-img",children:e.jsx("img",{src:T,alt:"Integrate your tools with Storybook to connect workflows."})})]}),`
`,e.jsxs("div",{className:"sb-section sb-socials",children:[e.jsxs("div",{className:"sb-section-item",children:[e.jsx("img",{src:v,alt:"Github logo",className:"sb-explore-image"}),e.jsx(s.p,{children:"Join our contributors building the future of UI development."}),e.jsxs("a",{href:"https://github.com/storybookjs/storybook",target:"_blank",children:["Star on GitHub",e.jsx(o,{})]})]}),e.jsxs("div",{className:"sb-section-item",children:[e.jsx("img",{src:k,alt:"Discord logo",className:"sb-explore-image"}),e.jsxs("div",{children:[e.jsx(s.p,{children:"Get support and chat with frontend developers."}),e.jsxs("a",{href:"https://discord.gg/storybook",target:"_blank",children:["Join Discord server",e.jsx(o,{})]})]})]}),e.jsxs("div",{className:"sb-section-item",children:[e.jsx("img",{src:N,alt:"Youtube logo",className:"sb-explore-image"}),e.jsxs("div",{children:[e.jsx(s.p,{children:"Watch tutorials, feature previews and interviews."}),e.jsxs("a",{href:"https://www.youtube.com/@chromaticui",target:"_blank",children:["Watch on YouTube",e.jsx(o,{})]})]})]}),e.jsxs("div",{className:"sb-section-item",children:[e.jsx("img",{src:_,alt:"A book",className:"sb-explore-image"}),e.jsx("p",{children:"Follow guided walkthroughs on for key workflows."}),e.jsxs("a",{href:"https://storybook.js.org/tutorials/",target:"_blank",children:["Discover tutorials",e.jsx(o,{})]})]})]}),`
`,e.jsx("style",{children:`
  .sb-container {
    margin-bottom: 48px;
  }

  .sb-section {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: 20px;
  }

  img {
    object-fit: cover;
  }

  .sb-section-title {
    margin-bottom: 32px;
  }

  .sb-section a:not(h1 a, h2 a, h3 a) {
    font-size: 14px;
  }

  .sb-section-item, .sb-grid-item {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .sb-section-item-heading {
    padding-top: 20px !important;
    padding-bottom: 5px !important;
    margin: 0 !important;
  }
  .sb-section-item-paragraph {
    margin: 0;
    padding-bottom: 10px;
  }

  .sb-chevron {
    margin-left: 5px;
  }

  .sb-features-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-gap: 32px 20px;
  }

  .sb-socials {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
  }

  .sb-socials p {
    margin-bottom: 10px;
  }

  .sb-explore-image {
    max-height: 32px;
    align-self: flex-start;
  }

  .sb-addon {
    width: 100%;
    display: flex;
    align-items: center;
    position: relative;
    background-color: #EEF3F8;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0.05);
    background: #EEF3F8;
    height: 180px;
    margin-bottom: 48px;
    overflow: hidden;
  }

  .sb-addon-text {
    padding-left: 48px;
    max-width: 240px;
  }

  .sb-addon-text h4 {
    padding-top: 0px;
  }

  .sb-addon-img {
    position: absolute;
    left: 345px;
    top: 0;
    height: 100%;
    width: 200%;
    overflow: hidden;
  }

  .sb-addon-img img {
    width: 650px;
    transform: rotate(-15deg);
    margin-left: 40px;
    margin-top: -72px;
    box-shadow: 0 0 1px rgba(255, 255, 255, 0);
    backface-visibility: hidden;
  }

  @media screen and (max-width: 800px) {
    .sb-addon-img {
      left: 300px;
    }
  }

  @media screen and (max-width: 600px) {
    .sb-section {
      flex-direction: column;
    }

    .sb-features-grid {
      grid-template-columns: repeat(1, 1fr);
    }

    .sb-socials {
      grid-template-columns: repeat(2, 1fr);
    }

    .sb-addon {
      height: 280px;
      align-items: flex-start;
      padding-top: 32px;
      overflow: hidden;
    }

    .sb-addon-text {
      padding-left: 24px;
    }

    .sb-addon-img {
      right: 0;
      left: 0;
      top: 130px;
      bottom: 0;
      overflow: hidden;
      height: auto;
      width: 124%;
    }

    .sb-addon-img img {
      width: 1200px;
      transform: rotate(-12deg);
      margin-left: 0;
      margin-top: 48px;
      margin-bottom: -40px;
      margin-left: -24px;
    }
  }
  `})]})}function Y(t={}){const{wrapper:s}=Object.assign({},c(),t.components);return s?e.jsx(s,Object.assign({},t,{children:e.jsx(m,t)})):m(t)}export{o as RightArrow,Y as default};
//# sourceMappingURL=Welcome-0e123f6c.js.map
