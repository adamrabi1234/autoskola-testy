import React from 'react';
import { X, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

export function Lightbox({ image, onClose }) {
    if (!image) return null;

    return (
        <div className="fixed inset-0 bg-black/95 z-[200] flex flex-col items-center justify-center animate-[fadeIn_0.2s_ease-out]">
            <button
                className="absolute top-5 right-5 bg-transparent text-white p-2.5 z-[210] hover:bg-white/10 rounded-full transition-colors"
                onClick={onClose}
            >
                <X size={32} />
            </button>

            <TransformWrapper
                initialScale={1}
                minScale={0.5}
                maxScale={4}
                centerOnInit={true}
                panning={{ excluded: ["lightbox-overlay"] }}
            >
                {({ zoomIn, zoomOut, resetTransform }) => (
                    <>
                        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 bg-white/10 p-2 rounded-full z-[210]">
                            <button className="bg-transparent text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" onClick={() => zoomIn()}><ZoomIn size={24} /></button>
                            <button className="bg-transparent text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" onClick={() => zoomOut()}><ZoomOut size={24} /></button>
                            <button className="bg-transparent text-white p-2 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors" onClick={() => resetTransform()}><RotateCcw size={24} /></button>
                        </div>

                        <div
                            className="lightbox-overlay absolute inset-0 z-0"
                            onClick={onClose}
                        />

                        <TransformComponent
                            wrapperClass="react-transform-wrapper"
                            wrapperStyle={{
                                width: "100vw",
                                height: "100vh",
                                position: 'relative',
                                zIndex: 1,
                                pointerEvents: 'none'
                            }}
                            contentStyle={{
                                width: "100%",
                                height: "100%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                pointerEvents: 'none'
                            }}
                        >
                            <img
                                src={image}
                                alt="Zoomed"
                                style={{
                                    maxWidth: '95%',
                                    maxHeight: '90vh',
                                    objectFit: 'contain',
                                    pointerEvents: 'auto'
                                }}
                            />
                        </TransformComponent>
                    </>
                )}
            </TransformWrapper>
        </div>
    );
}
