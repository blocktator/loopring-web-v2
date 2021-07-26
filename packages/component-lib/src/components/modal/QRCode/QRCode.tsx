import { WithTranslation, withTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import styled from '@emotion/styled';
import { Box, Modal, Typography } from '@material-ui/core';
import { ModalQRCodeProps, QRCodeProps } from './Interface';
import { ModalCloseButton } from '../../basic-lib';

const ModalContentStyled = styled(Box)`
  & > div {
    background-color: ${({theme}) => theme.colorBase.background().secondary};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: var(--modal-width);
  }
         //.modalClose {
         //    width: 100%;
         //    display: flex;
         //    justify-content: flex-end;
         //    margin: -16px 32px 16px 0;
         // }
 
`

// export interface ModalQRCodeProps {
//     // open: boolean;
//     // onClose: { bivarianceHack(event: {}, reason: 'backdropClick' | 'escapeKeyDown'): void; }['bivarianceHack'] | any;
//     address: string;
//     url: string;
//     btnAction?: (props?: any) => void;
// }

export const QRCodePanel = ((
    {
        // open,
        // onClose,
        // t,
        title,
        description,
        url = 'https://exchange.loopring.io/',
        // handleClick
    }: QRCodeProps) => {
    if (url === undefined) {
        url = ''
    }
    return <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'} flexDirection={'column'}>
        {title && (
            <Typography variant={'h3'} component='h3' className="modalTitle" marginBottom={3}>{title}</Typography>)}
        <QRCode value={url} size={160} style={{padding: 5, backgroundColor: '#fff'}} aria-label={`link:${url}`}/>
        {description && (<Typography variant={'body1'} marginBottom={3} marginTop={1}>{description}</Typography>)}

    </Box>
    {/* </div> */
    }
});

export const ModalQRCode = withTranslation('common')(({
                                                          onClose,
                                                          open,
                                                          t,
                                                          ...rest
                                                      }: ModalQRCodeProps & WithTranslation) => {


    return <Modal
        open={open}
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
    >
        <ModalContentStyled display={'flex'} alignItems={'center'} justifyContent={'center'}>
            <Box paddingTop={3} paddingBottom={3} display={'flex'} flexDirection={'column'}>
                <ModalCloseButton onClose={onClose} {...{...rest, t}} />
                <QRCodePanel {...{...rest, t}} />
            </Box>

        </ModalContentStyled>
    </Modal>
})

