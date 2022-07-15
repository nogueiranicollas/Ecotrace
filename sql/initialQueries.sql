-- querie apps
INSERT INTO public.apps (id,"URL",tag,is_active) VALUES
	 ('39162cec-08bf-4e39-882a-cbe26f2274c7'::uuid,'ecotrace.info','dev',true);

-- querie user_roles
INSERT INTO public.user_roles (id,description,created_at,deleted_at,updated_at,tag) VALUES
	 ('922da8fe-4827-4126-97a8-20a7c9ab285f'::uuid,'Administrador','2021-06-15 22:11:40.381',NULL,'2021-06-15 22:11:40.381','admin'),
	 ('9274c713-4c30-4ee2-85d5-6d12c89f9c49'::uuid,'Visualizador','2021-06-15 22:11:40.422',NULL,'2021-06-15 22:11:40.422','viewer');

-- querie users
usuario
insert
	into
	public.users (
	"firstName",
	"lastName",
	"CPF",
	email,
	email_recovery,
	phone,
	phone_recovery,
	pwd,
	lang,
	department,
	last_signin,
	avatar_id,
	role_id,
	created_at,
	deleted_at,
	updated_at,
	pwd_recovery_token)
values
	 ('Ecotrace',
'Solutions',
'40330463055',
'ecotrace@ecotrace.info',
'ecotrace2@sdfsd.com',
'44999999999',
'54888888888',
'$2b$08$XaRGPJvH9x4PSiJ9FTHJt.bv2tVaKX5AAPKEezUjSu7p/PWrbeG52',
'pt-BR',
'Development',
'2021-10-19 17:34:49.328',
null,
'922da8fe-4827-4126-97a8-20a7c9ab285f'::uuid,
'2021-07-01 08:56:45.134',
null,
'2021-10-19 17:34:49.347',
null);
