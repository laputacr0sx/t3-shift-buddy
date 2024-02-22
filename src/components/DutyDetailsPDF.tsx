import {
    Page,
    Text,
    View,
    Document,
    StyleSheet,
    PDFViewer,
    Font
} from '@react-pdf/renderer';
import { type inferProcedureOutput } from '@trpc/server';
import { type AppRouter } from '~/server/api/root';
function DutyDetailsPDF({
    dutyDetails
}: {
    readonly dutyDetails: inferProcedureOutput<
        AppRouter['dutyController']['getDutiesBySequence']
    >;
}) {
    return (
        // <div className="flex h-screen w-screen items-center justify-center">
        <PDFViewer
            width={'80%'}
            height={'100%'}
            showToolbar={true}
            className="flex h-screen w-screen items-center justify-center"
        >
            <Document style={{ width: '50' }}>
                <Page size="LETTER" style={styles.body}>
                    {dutyDetails.map((duty, i) => (
                        <View
                            style={styles.page}
                            key={`${duty.dutyNumber}${i}`}
                        >
                            <Text style={styles.title}>{duty.dutyNumber}</Text>
                            <Text style={styles.text}>
                                {duty.bNL}
                                {duty.bNT}-{duty.bFT}
                                {duty.bFL}
                            </Text>
                            <Text style={styles.text}>
                                {duty.duration}
                                {duty.remarks}
                            </Text>
                        </View>
                    ))}
                    <Text
                        style={styles.pageNumber}
                        render={({ pageNumber, totalPages }) =>
                            `${pageNumber} / ${totalPages}`
                        }
                        fixed
                    />
                </Page>
            </Document>
        </PDFViewer>
        // </div>
    );
}

export default DutyDetailsPDF;

Font.register({
    family: 'Oswald',
    src: 'https://fonts.gstatic.com/s/oswald/v13/Y_TKV6o8WovbUd3m_X9aAA.ttf'
});

// Create styles
const styles = StyleSheet.create({
    page: {
        // flexDirection: 'row',
        backgroundColor: '#E4E4E4',
        margin: 10,
        padding: 4
    },
    section: {
        margin: 10,
        padding: 10,
        flexGrow: 1
    },
    body: {
        paddingTop: 10,
        paddingBottom: 20,
        paddingHorizontal: 5
    },
    title: {
        fontSize: 24,
        textAlign: 'left',
        fontFamily: 'Oswald'
    },
    author: {
        fontSize: 12,
        textAlign: 'center',
        marginBottom: 40
    },
    subtitle: {
        fontSize: 18,
        margin: 12,
        fontFamily: 'Oswald'
    },
    text: {
        margin: 2,
        fontSize: 14,
        textAlign: 'justify',
        fontFamily: 'Times-Roman'
    },
    image: {
        marginVertical: 15,
        marginHorizontal: 100
    },
    header: {
        fontSize: 12,
        marginBottom: 20,
        textAlign: 'center',
        color: 'grey'
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey'
    }
});
