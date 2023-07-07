import { useState } from "react";
import { styled } from "styled-components";
import Button from "@mui/material/Button";

import usePurchaseReducer from "../hooks/usePurchaseReducer";
import Alert from "../components/Alert";
import { CircularProgress } from "@mui/material";

export default function Profile() {
  const { setLoading, success, errorMessage, state } = usePurchaseReducer(null);
  const { confirmed, error, loading } = state;
  const user = JSON.parse(window.sessionStorage.getItem("user"));

  const [formData, setFormData] = useState({});
  if (!user) {
    window.history.back();
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
  };
  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.id]: event.target.value });
  };
  console.log(formData);
  return (
    <Wrapper>
      <Head>
        <ProfilePhoto src={user.picture} />
        <Name>{user.name}</Name>
      </Head>
      <ProfileDetails onSubmit={handleSubmit}>
        <UnstyledFieldSet>
          <NameField>
            <label htmlFor="name">Name: </label>
            <input
              type="text"
              id="name"
              defaultValue={user.name}
              onChange={handleChange}
            />
          </NameField>
          <NickNameField>
            <label htmlFor="nickname">Nickname: </label>
            <input
              type="text"
              id="nickname"
              defaultValue={user.nickname}
              onChange={handleChange}
            />
          </NickNameField>
          <EmailField>
            <label htmlFor="email">Email: </label>
            <input
              type="email"
              id="email"
              defaultValue={user.email || "N/a"}
              onChange={handleChange}
            />
          </EmailField>
        </UnstyledFieldSet>
        <ButtonContainer>
          <Button
            variant="contained"
            disabled={loading}
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
  );
}

const Wrapper = styled.div`
  position: relative;
  top: 56px;
  width: 85vw;
  margin: 0 auto;
`;

const ProfilePhoto = styled.img`
  width: 100px;
  object-fit: cover;
  border-radius: 50%;
`;

const Head = styled.div`
  display: flex;
  height: 15vh;
`;
const Name = styled.h3`
  height: 25px;
  position: relative;
  top: 85px;
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
