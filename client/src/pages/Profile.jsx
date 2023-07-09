import { useContext } from "react";
import { styled } from "styled-components";
import Button from "@mui/material/Button";

import useProfileReducer from "../hooks/useProfileReducer";
import Alert from "../components/Alert";
import { CircularProgress } from "@mui/material";
import { useAuth0 } from "@auth0/auth0-react";
import { UserContext } from "../context/UserContext";

export default function Profile() {
  const { getAccessTokenSilently, logout } = useAuth0();
  const { setLoading, success, errorMessage, dispatch, state } =
    useProfileReducer();
  const { formData, confirmed, error, loading } = state;
  const { currentUser } = useContext(UserContext);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      setLoading();
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`/user/update/${currentUser._id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(formData),
      });
      const { status } = await response.json();
      if (status === 200) {
        return success({ ...currentUser, ...formData });
      } else {
        errorMessage("Nothing to change");
      }
    } catch (error) {
      errorMessage(error.message);
    }
  };

  const handleChange = (event) => {
    dispatch({
      type: "field",
      field: "formData",
      payload: { ...formData, [event.target.id]: event.target.value },
    });
  };

  const handleDeactivate = async () => {
    try {
      setLoading();
      const accessToken = await getAccessTokenSilently();
      const response = await fetch(`/user`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ _id: currentUser._id }),
      });
      const data = await response.json();
      if (data.status === 204) {
        success();
        return logout();
      }
    } catch (error) {
      errorMessage(error.message);
    }
  };

  return (
    currentUser && (
      <Wrapper>
        <Head>
          <ProfilePhoto src={currentUser.picture} />
        </Head>
        <ProfileDetails onSubmit={handleSubmit}>
          <UnstyledFieldSet>
            <NameField>
              <label htmlFor="name">Full Name: </label>
              <input
                type="text"
                id="name"
                defaultValue={currentUser.name}
                onChange={handleChange}
              />
            </NameField>
            <NickNameField>
              <label htmlFor="nickname">Nickname: </label>
              <input
                type="text"
                id="nickname"
                defaultValue={currentUser.nickname}
                onChange={handleChange}
              />
            </NickNameField>
            <EmailField>
              <label htmlFor="email">Email: </label>
              <input
                type="email"
                id="email"
                placeholder="yourEmail@email.com"
                defaultValue={currentUser.email}
                onChange={handleChange}
              />
            </EmailField>
            <EmailField>
              <label htmlFor="address">Address: </label>
              <input
                type="address"
                id="address"
                placeholder="81 Address Rd."
                defaultValue={currentUser.address}
                onChange={handleChange}
              />
            </EmailField>
            <EmailField>
              <label htmlFor="phone">Phone: </label>
              <input
                type="tel"
                id="telephone"
                placeholder="Ex. 860-575-1337"
                defaultValue={currentUser.telephone}
                onChange={handleChange}
              />
            </EmailField>
          </UnstyledFieldSet>
          <ButtonContainer>
            <Button
              variant="contained"
              disabled={loading || confirmed}
              color="success"
              type="submit"
            >
              {loading ? (
                <CircularProgress />
              ) : confirmed ? (
                "Confirmed"
              ) : (
                "Save Changes"
              )}
            </Button>
            <Button variant="outlined" color="error">
              Deactivate Account
            </Button>
          </ButtonContainer>
        </ProfileDetails>
        {error && <Alert severity="error">{error}</Alert>}
      </Wrapper>
    )
  );
}

const Wrapper = styled.div`
  position: relative;
  top: 56px;
  width: 85vw;
  margin: 0 auto;
`;

const ProfilePhoto = styled.img`
  width: 50px;
  height: 50px;
  overflow: hidden;
  object-fit: cover;
  border-radius: 50%;
`;

const Head = styled.div`
  display: flex;
  justify-content: center;
  padding: 1rem;
`;

const ProfileDetails = styled.form``;
const UnstyledFieldSet = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
`;

const NameField = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 1rem 0;
`;
const NickNameField = styled(NameField)``;
const EmailField = styled(NameField)``;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;
