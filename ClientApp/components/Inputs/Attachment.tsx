
import * as React from 'react'
import Dropzone from 'react-dropzone'

export default class Attachment extends React.Component<any, any> {
    constructor() {
        super()
        this.state = { files: [] }
    }

    onDrop(files) {
        this.setState({
            files
        });
    }

    public render() {
        return (
            <section>
                <div className="dropzone">
                    <Dropzone onDrop={this.onDrop.bind(this)}>
                        <p>Try dropping some files here, or click to select files to upload.</p>
                    </Dropzone>
                </div>
                <aside>
                    <h2>Dropped files</h2>
                    <ul>
                        {
                            this.state.files.map(f => <li key={f.name}>{f.name} - {f.size} bytes</li>)
                        }
                    </ul>
                </aside>
            </section>
        )
    }
}