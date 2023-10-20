import { createTheme } from "@mui/material";

export const theme = createTheme({
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        *, *::before, *::after {
          box-sizing: border-box;
        }
        * {
          margin: 0;
        }
        body {
          line-height: 1.5;
          -webkit-font-smoothing: antialiased;
          font-family: futura-pt,"system-ui",Helvetica Neue,"sans-serif";
          background-color: black;
          color: #eceff4;
          font-size: 14px;
        }
        img, picture, video, canvas, svg {
          display: block;
          max-width: 100%;
        }
        div {
          animation: fadeIn ease-in-out 500ms;
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }
        }
        input, button, textarea, select {
          font: inherit;
        }
        p, h1, h2, h3, h4, h5, h6 {
          overflow-wrap: break-word;
        }
        #root, #__next {
          isolation: isolate;
        }
        .react-reveal{
        animation-fill-mode: backwards !important;
        }
      `,
    },
  },
});
