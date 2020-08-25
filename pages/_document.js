import Document, {Head, Main, NextScript} from 'next/document';
import {ServerStyleSheets} from '@material-ui/styles';
import flush from 'styled-jsx/server';

export default class RootDocument extends Document {
    static async getInitialProps(ctx) {
        const sheets = new ServerStyleSheets();
        const originalRenderPage = ctx.renderPage;

        ctx.renderPage = () =>
            originalRenderPage({
                enhanceApp: App => props => sheets.collect(<App {...props} />),
            });

        const initialProps = await Document.getInitialProps(ctx);

        return {
            ...initialProps,
            styles: (
                <>
                    {sheets.getStyleElement()}
                    {flush() || null}
                </>
            ),
        };
    }

    render() {
        return (
            <html>
            <Head/>
            <body>
            <Main/>
            <NextScript/>
            </body>
            </html>
        );
    }
}
