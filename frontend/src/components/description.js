import React from 'react';

function Description(props) {
    return (
        <div>
        <h1 className={'text-align-center'}>About</h1>
        <h2>Overview</h2>
        <div className={'padding-top-20'}>
        <p>
        This data was generated as part of IGO's 2024 Open House.
        We asked visitors for their voluntary participation to "swab" their mobile phones to collect microorganisms associated with their personal device.
        They received an annonymized identification number they could use to obtain their sequencing results, which are available on the <a href={"https://igo.mskcc.org/swabnseq"} target="_blank" rel="noopener noreferrer">Data</a> page.
        </p>
        </div>
        <h2>Extraction/Sequencing</h2>
        <div className={'padding-top-20'}>
        <p>
        DNA was extracted directly from swabs. Samples were extracted using the Extract-N-Amp Plant PCR kit (Sigma Aldrich). Each swab tip was added to 100 µl of extraction solution, heated for 10 min at 95 °C, and 100 µl of dilution solution added. Finally, the V4 region of bacterial 16S rRNA gene was amplified and prepped for amplicon sequencing <a href={"https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4081285/#ref-16"} target="_blank" rel="noopener noreferrer">(Flores, Henley & Fierer, 2012)</a>
        </p>
        </div>
        <h2>Data</h2>
        <div className={'padding-top-20'}>
        <p>
        Data was generated using the open-source bioinformatics tool, <a href={"https://qiime2.org/"} target="_blank" rel="noopener noreferrer">Qiime</a>.
        </p>
        </div>
        <h2>Contact</h2>
        <div className={'padding-top-20'}>
        <p>Email <a href="mailto:genomics@mskcc.org">genomics@mskcc.org</a> for questions or to book a consultation</p>
    </div>
    </div>
);
};

export default Description;
