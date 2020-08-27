import React from 'react';
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import {DialogContentText} from "@material-ui/core";
import {useSnackbar} from "notistack";
import TextField from "@material-ui/core/TextField";
import Router from "next/router";

const DeleteUser = ({setState}) => {
    const [confirm, setConfirm] = React.useState(false)
    const [pw, setPw] = React.useState('')
    const s = useSnackbar()
    const [processing, setProcessing] = React.useState(false)

    return (
        <div style={{width: '100%'}}>
            <DialogActions>
                <Button color="secondary" onClick={() => setConfirm(true)}>
                    회원 탈퇴하기
                </Button>
            </DialogActions>
            <Dialog open={confirm}>
                <DialogTitle>
                    계정 삭제
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        계정을 삭제하면 유저 정보가 모두 삭제됩니다.
                        자신이 작성한 글은 모두 삭제됩니다. 삭제하려면 아래에 비밀번호를 입력하고 삭제 버튼을 눌러주세요
                    </DialogContentText>
                    <TextField fullWidth onChange={e => setPw(e.target.value)} type="password" label="비밀번호 입력"/>
                </DialogContent>
                <DialogActions>
                    <Button disabled={processing} color="primary" onClick={() => setConfirm(false)}>
                        취소
                    </Button>
                    <Button color="secondary" disabled={processing} onClick={async () => {
                        s.enqueueSnackbar('처리중....', {
                            variant: 'info'
                        })
                        setProcessing(true)
                        const d = await (await fetch('/api/user/delete', {
                            method: 'POST',
                            body: JSON.stringify({
                                password: pw
                            }),
                            headers: {
                                Authorization: 'Bearer ' + localStorage.getItem('token'),
                                'Content-Type': 'application/json'
                            }
                        })).json()
                        if (d.error) {
                            setProcessing(false)
                            s.enqueueSnackbar(d.error, {
                                variant: 'error'
                            })
                            return setConfirm(false)
                        }
                        s.enqueueSnackbar('계정이 삭제되었습니다.', {
                            variant: 'warning'
                        })
                        localStorage.removeItem('token')
                        setState({user: null})
                        await Router.push('/login')
                    }}>
                        삭제
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default DeleteUser;
