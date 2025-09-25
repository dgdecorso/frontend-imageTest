import { useNavigate, useParams } from 'react-router-dom';
import { User } from '../../../types/models/User.model';
import UserService from '../../../Services/UserService';
import UserForm from '../../molecules/UserForm/UserForm';
import { useEffect, useState } from 'react';

const UserPage = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState<User>({
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    roles: [],
  });

  useEffect(() => {
    if (userId) {
      UserService.getUser(userId).then((res) => {
        setUser(res);
      }).catch((error) => {
        console.error('Error loading user:', error);
        alert('Fehler beim Laden des Benutzers.');
      });
    }
  }, [userId]);

  const submitActionHandler = async (values: User) => {
    try {
      if (userId !== undefined) {
        await UserService.updateUser(values);
        alert('Benutzer erfolgreich aktualisiert!');
        navigate('/users');
      } else {
        await UserService.addUser(values);
        alert('Benutzer erfolgreich erstellt!');
        navigate('/users');
      }
    } catch (error) {
      console.error('Error saving user:', error);
      alert('Fehler beim Speichern des Benutzers. Überprüfen Sie Ihre Admin-Berechtigung.');
    }
  };

  return <UserForm user={user} submitActionHandler={submitActionHandler} />;
};
export default UserPage;
