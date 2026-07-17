import { useEffect, useMemo, useState } from 'react';
import {
  Camera,
  CheckCircle2,
  IdCard,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from 'lucide-react';
import { Alert } from '../components/Alert.jsx';
import { Button } from '../components/Button.jsx';
import { Field } from '../components/Field.jsx';
import {
  confirmPhoneChangeRequest,
  confirmUsernameChangeRequest,
  requestPhoneChangeRequest,
  requestUsernameChangeRequest,
  updateProfileImageRequest,
  updateProfileRequest,
} from '../api/authApi.js';
import { useAuth } from '../hooks/useAuth.js';
import { normalizeAuthError } from '../utils/authResponse.js';
import { getUserRole } from '../utils/roles.js';
import { DEFAULT_USER_IMAGE, DEFAULT_USER_IMAGE_ALT } from '../utils/assets.js';

function getResponseUser(response) {
  return response?.data || response?.user || null;
}

export function ProfilePage() {
  const { user, updateSessionUser } = useAuth();
  const [values, setValues] = useState({
    name: user?.name || '',
    surname: user?.surname || '',
  });
  const [identity, setIdentity] = useState({
    newUsername: '',
    usernameToken: '',
    newPhone: '',
    phoneToken: '',
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(user?.profilePicture || DEFAULT_USER_IMAGE);
  const [notice, setNotice] = useState(null);
  const [error, setError] = useState(null);
  const [loadingKey, setLoadingKey] = useState('');

  const displayName = useMemo(
    () => [user?.name, user?.surname].filter(Boolean).join(' ') || user?.username || 'Usuario',
    [user]
  );

  useEffect(() => {
    setValues({
      name: user?.name || '',
      surname: user?.surname || '',
    });
    setPreviewUrl(user?.profilePicture || DEFAULT_USER_IMAGE);
  }, [user]);

  useEffect(() => {
    if (!selectedFile) return undefined;
    const nextPreview = URL.createObjectURL(selectedFile);
    setPreviewUrl(nextPreview);
    return () => URL.revokeObjectURL(nextPreview);
  }, [selectedFile]);

  const handleValueChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleIdentityChange = (event) => {
    const { name, value } = event.target;
    setIdentity((current) => ({ ...current, [name]: value }));
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!values.name.trim() && !values.surname.trim()) {
      setError({ message: 'Ingresa al menos nombre o apellido.' });
      return;
    }

    try {
      setLoadingKey('profile');
      const response = await updateProfileRequest(values);
      const nextUser = getResponseUser(response);
      if (nextUser) updateSessionUser(nextUser);
      setNotice(response.message || 'Perfil actualizado correctamente.');
    } catch (requestError) {
      setError(normalizeAuthError(requestError));
    } finally {
      setLoadingKey('');
    }
  };

  const handleImageSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!selectedFile) {
      setError({ message: 'Selecciona una imagen para subir.' });
      return;
    }

    try {
      setLoadingKey('image');
      const response = await updateProfileImageRequest(selectedFile);
      const nextUser = getResponseUser(response);
      if (nextUser) updateSessionUser(nextUser);
      setSelectedFile(null);
      setNotice(response.message || 'Foto actualizada correctamente.');
    } catch (requestError) {
      setError(normalizeAuthError(requestError));
    } finally {
      setLoadingKey('');
    }
  };

  const requestUsernameChange = async (event) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!identity.newUsername.trim()) {
      setError({ message: 'Ingresa el nuevo usuario.' });
      return;
    }

    try {
      setLoadingKey('usernameRequest');
      const response = await requestUsernameChangeRequest(identity.newUsername.trim());
      setNotice(response.message || 'Token enviado para confirmar usuario.');
    } catch (requestError) {
      setError(normalizeAuthError(requestError));
    } finally {
      setLoadingKey('');
    }
  };

  const confirmUsernameChange = async (event) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!identity.usernameToken.trim()) {
      setError({ message: 'Ingresa el token de confirmacion.' });
      return;
    }

    try {
      setLoadingKey('usernameConfirm');
      const response = await confirmUsernameChangeRequest(identity.usernameToken.trim());
      const nextUser = getResponseUser(response);
      if (nextUser) updateSessionUser(nextUser);
      setIdentity((current) => ({ ...current, newUsername: '', usernameToken: '' }));
      setNotice(response.message || 'Usuario actualizado correctamente.');
    } catch (requestError) {
      setError(normalizeAuthError(requestError));
    } finally {
      setLoadingKey('');
    }
  };

  const requestPhoneChange = async (event) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!identity.newPhone.trim()) {
      setError({ message: 'Ingresa el nuevo telefono.' });
      return;
    }

    try {
      setLoadingKey('phoneRequest');
      const response = await requestPhoneChangeRequest(identity.newPhone.trim());
      setNotice(response.message || 'Token enviado para confirmar telefono.');
    } catch (requestError) {
      setError(normalizeAuthError(requestError));
    } finally {
      setLoadingKey('');
    }
  };

  const confirmPhoneChange = async (event) => {
    event.preventDefault();
    setError(null);
    setNotice(null);

    if (!identity.phoneToken.trim()) {
      setError({ message: 'Ingresa el token de confirmacion.' });
      return;
    }

    try {
      setLoadingKey('phoneConfirm');
      const response = await confirmPhoneChangeRequest(identity.phoneToken.trim());
      const nextUser = getResponseUser(response);
      if (nextUser) updateSessionUser(nextUser);
      setIdentity((current) => ({ ...current, newPhone: '', phoneToken: '' }));
      setNotice(response.message || 'Telefono actualizado correctamente.');
    } catch (requestError) {
      setError(normalizeAuthError(requestError));
    } finally {
      setLoadingKey('');
    }
  };

  return (
    <section className="profile-page">
      <header className="page-heading">
        <div>
          <p className="eyebrow">Perfil</p>
          <h1>Datos de tu cuenta</h1>
        </div>
        <IdCard size={34} strokeWidth={1.5} />
      </header>

      <Alert tone="success" message={notice} onClose={() => setNotice(null)} />
      <Alert tone="error" message={error?.message} details={error?.errors || []} />

      <div className="profile-layout">
        <aside className="profile-card">
          <div className="profile-avatar">
            <img
              src={previewUrl || DEFAULT_USER_IMAGE}
              alt={displayName}
              onError={(event) => {
                if (!event.currentTarget.dataset.altTried) {
                  event.currentTarget.dataset.altTried = 'true';
                  event.currentTarget.src = DEFAULT_USER_IMAGE_ALT;
                  return;
                }
                event.currentTarget.style.display = 'none';
              }}
            />
          </div>
          <strong>{displayName}</strong>
          <span>{user?.email}</span>
          <div className="profile-facts">
            <span>
              <ShieldCheck size={16} strokeWidth={1.8} />
              {getUserRole(user)}
            </span>
            <span>
              <Mail size={16} strokeWidth={1.8} />
              {user?.username}
            </span>
            <span>
              <Phone size={16} strokeWidth={1.8} />
              {user?.phone || 'Sin telefono'}
            </span>
          </div>

          <form className="image-upload-panel" onSubmit={handleImageSubmit}>
            <label className="file-picker" htmlFor="profilePicture">
              <Camera size={20} strokeWidth={1.8} />
              <span>{selectedFile?.name || 'Seleccionar imagen'}</span>
              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={(event) => setSelectedFile(event.target.files?.[0] || null)}
              />
            </label>
            <Button type="submit" isLoading={loadingKey === 'image'}>
              Subir foto
            </Button>
          </form>
        </aside>

        <div className="profile-panels">
          <form className="profile-panel" onSubmit={handleProfileSubmit} noValidate>
            <div className="section-title">
              <span>Datos basicos</span>
              <CheckCircle2 size={20} strokeWidth={1.8} />
            </div>
            <div className="field-grid">
              <Field
                id="name"
                name="name"
                label="Nombre"
                icon={UserRound}
                value={values.name}
                onChange={handleValueChange}
              />
              <Field
                id="surname"
                name="surname"
                label="Apellido"
                icon={UserRound}
                value={values.surname}
                onChange={handleValueChange}
              />
            </div>
            <Button type="submit" isLoading={loadingKey === 'profile'}>
              Guardar datos
            </Button>
          </form>

          <div className="profile-split">
            <form className="profile-panel" onSubmit={requestUsernameChange} noValidate>
              <div className="section-title">
                <span>Usuario</span>
                <Mail size={20} strokeWidth={1.8} />
              </div>
              <Field
                id="newUsername"
                name="newUsername"
                label="Nuevo usuario"
                icon={UserRound}
                value={identity.newUsername}
                onChange={handleIdentityChange}
              />
              <Button type="submit" isLoading={loadingKey === 'usernameRequest'}>
                Enviar token
              </Button>
            </form>

            <form className="profile-panel" onSubmit={confirmUsernameChange} noValidate>
              <div className="section-title">
                <span>Confirmar usuario</span>
                <CheckCircle2 size={20} strokeWidth={1.8} />
              </div>
              <Field
                id="usernameToken"
                name="usernameToken"
                label="Token"
                icon={ShieldCheck}
                value={identity.usernameToken}
                onChange={handleIdentityChange}
              />
              <Button type="submit" isLoading={loadingKey === 'usernameConfirm'}>
                Confirmar
              </Button>
            </form>
          </div>

          <div className="profile-split">
            <form className="profile-panel" onSubmit={requestPhoneChange} noValidate>
              <div className="section-title">
                <span>Telefono</span>
                <Phone size={20} strokeWidth={1.8} />
              </div>
              <Field
                id="newPhone"
                name="newPhone"
                label="Nuevo telefono"
                icon={Phone}
                value={identity.newPhone}
                onChange={handleIdentityChange}
              />
              <Button type="submit" isLoading={loadingKey === 'phoneRequest'}>
                Enviar token
              </Button>
            </form>

            <form className="profile-panel" onSubmit={confirmPhoneChange} noValidate>
              <div className="section-title">
                <span>Confirmar telefono</span>
                <CheckCircle2 size={20} strokeWidth={1.8} />
              </div>
              <Field
                id="phoneToken"
                name="phoneToken"
                label="Token"
                icon={ShieldCheck}
                value={identity.phoneToken}
                onChange={handleIdentityChange}
              />
              <Button type="submit" isLoading={loadingKey === 'phoneConfirm'}>
                Confirmar
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
