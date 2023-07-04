import { Alert as AlertComponent } from "@mui/material";
export default function Alert({ severity, children }) {
  return (
    <AlertComponent
      severity={severity}
      sx={{
        backgroundColor:
          severity === "success" ? "rgb(12, 19, 13)" : "rgb(22, 11, 11)",
        margin: "1rem 0",
      }}
    >
      {children}
    </AlertComponent>
  );
}
