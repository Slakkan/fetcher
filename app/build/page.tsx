"use client"
import { FunctionComponent, useState } from "react";
import Canvas, { SavedRectangle } from "../../components/canvas/Canvas.component";


const Build: FunctionComponent = () => {
    const [savedRectangles, setSavedRectangles] = useState<SavedRectangle[]>([])
    return (
        <div className="container d-flex flex-column align-items-center background--white" style={{ flexGrow: 1 }}>
            <Canvas id="potato" savedRectangles={savedRectangles} setSavedRectangles={setSavedRectangles} />
        </div>
    );
};

export default Build;