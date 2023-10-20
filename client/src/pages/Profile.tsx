import { FormEventHandler, useState } from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { CircularProgress, styled } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";

import useProfileReducer, { ReducerType } from "../hooks/useProfileReducer";
import Alert from "../components/Alert";
import { useCurrentUser } from "../hooks/useCurrentUser";

export default function Profile() {
  const { getAccessTokenSilently, logout } = useAuth0();
  const { setLoading, success, errorMessage, dispatch, state } =
    useProfileReducer();
  const { formData, confirmed, error, loading } = state;
  const { currentUser } = useCurrentUser();
  const [open, setOpen] = useState(false);
  const { VITE_SERVER_URL } = import.meta.env;

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault();
    try {
      setLoading();
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${VITE_SERVER_URL}/users`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      if (response.status === 200) {
        const data = await response.json();
        success(data);
        return;
      } else {
        errorMessage("Nothing to change");
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMessage(error.message);
      }
    }
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({
      type: ReducerType.formData,
      payload: { ...formData, [event.target.id]: event.target.value },
    });
  };

  const handleDeactivate = async () => {
    try {
      setLoading();
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`${VITE_SERVER_URL}/users`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (response.status === 200) {
        window.sessionStorage.clear();
        return logout({ logoutParams: { returnTo: "http://localhost:3000" } });
      } else {
        const data = await response.json();
        errorMessage(data.message);
      }
    } catch (error) {
      if (error instanceof Error) {
        errorMessage(error.message);
      }
    }
  };

  return (
    currentUser && (
      <Wrapper>
        <Head>
          <ProfilePhoto src={currentUser.picture} />
        </Head>
        <form onSubmit={handleSubmit}>
          <UnstyledFieldSet>
            <Field>
              <label htmlFor="name">Full Name: </label>
              <input
                type="text"
                id="name"
                defaultValue={currentUser.name}
                onChange={handleChange}
              />
            </Field>
            <Field>
              <label htmlFor="nickname">Nickname: </label>
              <input
                type="text"
                id="nickname"
                defaultValue={currentUser.nickname}
                onChange={handleChange}
              />
            </Field>
            <Field>
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                id="email"
                required
                placeholder="yourEmail@email.com"
                defaultValue={currentUser.email}
                onChange={handleChange}
              />
            </Field>
            <Field>
              <label htmlFor="address">Address: </label>
              <input
                type="address"
                id="address"
                placeholder="81 Address Rd."
                defaultValue={currentUser.address}
                onChange={handleChange}
              />
            </Field>
            <Field>
              <label htmlFor="phone">Phone: </label>
              <input
                type="tel"
                id="telephone"
                placeholder="Ex. 860-575-1337"
                defaultValue={currentUser.telephone}
                onChange={handleChange}
              />
            </Field>
          </UnstyledFieldSet>
          <ButtonContainer>
            <Button
              variant="outlined"
              disabled={
                loading || confirmed || Object.keys(formData).length === 0
              }
              color={loading ? "secondary" : "success"}
              type="submit"
              sx={{
                "&.Mui-disabled": {
                  color: "#c0c0c0",
                },
              }}
            >
              {loading ? (
                <CircularProgress sx={{ color: "#027326" }} />
              ) : confirmed ? (
                "Saved"
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => setOpen(!open)}
            >
              Delete Account
            </Button>
          </ButtonContainer>
          <Dialog open={open} onClose={logout}>
            <DialogContent>
              <DialogContentText>
                Are you sure you want to delete your account? All of your watch
                lists, holdings, and account balance will be deleted.
              </DialogContentText>
              <DialogContentText color="error">
                {error && error}
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button color="error" onClick={handleDeactivate}>
                Delete account
              </Button>
              <Button color="success" onClick={() => setOpen(!open)}>
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        </form>
        {error && <Alert severity="error">{error}</Alert>}
      </Wrapper>
    )
  );
}

const Wrapper = styled("div")`
  position: relative;
  top: 56px;
  width: 85vw;
  margin: 0 auto;
  @media (min-width: 500px) {
    max-width: 400px;
  }
`;

const ProfilePhoto = styled("img")`
  width: 50px;
  height: 50px;
  overflow: hidden;
  object-fit: cover;
  border-radius: 50%;
`;

const Head = styled("div")`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;

const UnstyledFieldSet = styled("fieldset")`
  border: none;
  padding: 0;
  margin: 0;
`;

const Field = styled("div")`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 1rem 0;
`;

const ButtonContainer = styled("div")`
  display: flex;
  justify-content: space-evenly;
`;
