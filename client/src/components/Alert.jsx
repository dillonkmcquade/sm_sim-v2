import { Alert } from "@mui/material";
export default function Alert({ severity, children }) {
  return (
    <AlertComponent
      severity={severity}
      sx={{
        backgroundColor:
          severity === "success" ? "rgb(12, 19, 13)" : "rgb(22, 11, 11)",
      }}
    >
      {children}
    </AlertComponent>
  );
}

const AlertComponent = styled(Alert)`
  margin: 1rem 0;
  width: 100%;

  @media (min-width: 500px) {
    max-width: 500px;
  }
`;
