
import { useRouter } from 'next/router';

const { Grid } = require("@mui/material");
const { default: Reports } = require(".");

const ProjectDetails = () => {
    const router = useRouter();
    const { slug } = router.query;

    // Check if slug is defined
    if (!slug) {
        return <div>Loading...</div>; // Or any other loading indicator
    }

    const id = slug[1] || null;
    const tab = slug[0] || null;

    return (
        <Grid>
            <Reports id={id} tab={tab} />
        </Grid>
    );
};
export default ProjectDetails