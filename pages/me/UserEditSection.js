import {Grid} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import React from "react";
import {useSnackbar} from "notistack";

export default function UserEditSection({u}) {
    const [updating, setUpdating] = React.useState(false)
    const [username, setUsername] = React.useState(undefined)
    const [email, setEmail] = React.useState(undefined)
    const [password, setPassword] = React.useState(undefined)
    const [newPassword, setNewPassword] = React.useState(undefined)

    const snackbar = useSnackbar()

    if (u) {
        if (u.username) {
            if (username === undefined) {
                setUsername(u.username)
            }
        } else {
            if (username === undefined) setUsername('')
        }
        if (u.email) {
            if (email === undefined) {
                setEmail(u.email)
            }
        } else {
            if (email === undefined) setEmail('')
        }
    }

    return (
        <Grid item style={{width: '100%'}}>
            <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                    <TextField disabled={updating} label="닉네임"
                               variant="outlined" fullWidth value={username}
                               onChange={e => setUsername(e.target.value)}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="이메일" disabled={updating} type="email" variant="outlined"
                               fullWidth value={email}
                               onChange={e => setEmail(e.target.value)}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="비밀번호" variant="outlined" disabled={updating} fullWidth type="password"
                               onChange={e => setPassword(e.target.value)}/>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField label="새 비밀번호" variant="outlined" fullWidth disabled={updating} type="password"
                               onChange={e => setNewPassword(e.target.value)}/>
                </Grid>
                <Grid item xs={12}>
                    <Button disabled={updating} onClick={async () => {
                        setUpdating(true)
                        const d = await (await fetch('/api/user/update', {
                            method: 'PATCH',
                            body: JSON.stringify({
                                username, email, password, newPassword
                            }),
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: 'Bearer ' + localStorage.getItem('token')
                            }
                        })).json()
                        if (d.error) {
                            snackbar.enqueueSnackbar(d.error, {
                                variant: 'error'
                            })
                            return setUpdating(false)
                        }
                        snackbar.enqueueSnackbar('성공적으로 처리되었습니다.', {
                            variant: 'success'
                        })
                        setUpdating(false)
                    }} variant="contained" color="primary" style={{width: '100%'}}>
                        {updating ? <CircularProgress size={24}/> : '저장'}
                    </Button>
                </Grid>
            </Grid>
        </Grid>
    )
}
