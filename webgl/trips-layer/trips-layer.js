import {Layer} from 'deck.gl';

import {Model, Geometry} from 'luma.gl';

import tripsVertex from './trips-layer-vertex.glsl';
import tripsFragment from './trips-layer-fragment.glsl';

const defaultProps = {
  trailLength: 120,
  currentTime: 0,
  getPath: d => d.path,
  getColor: d => d.color
};

export default class TripsLayer extends Layer {
  initializeState() {
    const {gl} = this.context;
    const attributeManager = this.getAttributeManager();

    console.log('starting get model');
    const timeC = performance.now();
    const model = this.getModel(gl);
    console.log(`finishing get model after ${performance.now() - timeC}ms`);

    console.log('starting attribute manager');
    const timeD = performance.now();
    attributeManager.add({
      indices: {size: 1, update: this.calculateIndices, isIndexed: true},
      positions: {size: 3, update: this.calculatePositions},
      colors: {size: 3, update: this.calculateColors}
    });
    console.log(`finishing attribute manager after ${performance.now() - timeD}ms`);

    gl.getExtension('OES_element_index_uint');
    this.setState({model});
  }

  updateState({props, changeFlags: {dataChanged}}) {
    if (dataChanged) {
      this.state.attributeManager.invalidateAll();
    }
  }

  getModel(gl) {
    return new Model(gl, {
      id: this.props.id,
      vs: tripsVertex,
      fs: tripsFragment,
      geometry: new Geometry({
        id: this.props.id,
        drawMode: 'LINES'
      }),
      vertexCount: 0,
      isIndexed: true,
      // TODO-state-management: onBeforeRender can go to settings, onAfterRender, we should
      // move this settings of corresponding draw.
      onBeforeRender: () => {
        gl.enable(gl.BLEND);
        gl.enable(gl.POLYGON_OFFSET_FILL);
        gl.polygonOffset(2.0, 1.0);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
        gl.blendEquation(gl.FUNC_ADD);
      },
      onAfterRender: () => {
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.disable(gl.POLYGON_OFFSET_FILL);
      }
    });
  }

  draw({uniforms}) {
    const {trailLength, currentTime} = this.props;
    this.state.model.render(
      Object.assign({}, uniforms, {
        trailLength,
        currentTime
      })
    );
  }

  calculateIndices(attribute) {
    const {data} = this.props;
    const timeA = performance.now();
    console.log('starting calc indices');

    console.log(data.length);
    const indicesCount = data.length * 2;
    const indices = new Uint32Array(indicesCount);

    let offset = 0;
    let index = 0;
    for (let i = 0; i < data.length; i++) {
      const l = 2;
      indices[index++] = offset;
      for (let j = 1; j < l - 1; j++) {
        indices[index++] = j + offset;
        indices[index++] = j + offset;
      }
      indices[index++] = offset + l - 1;
      offset += l;
    }
    attribute.value = indices;
    this.state.model.setVertexCount(indicesCount);
    console.log(`finishing calc indices after ${performance.now() - timeA}ms`);
  }

  calculatePositions(attribute) {
    const timeB = performance.now();
    console.log('starting calc positions');
    const {data, getPath} = this.props;
    const positions = new Float32Array(data.length * 2 * 3);

    let index = 0;
    for (let i = 0; i < data.length; i++) {
      const path = getPath(data[i]);
      for (let j = 0; j < path.length; j++) {
        const pt = path[j];
        positions[index++] = pt[0];
        positions[index++] = pt[1];
        positions[index++] = pt[2];
      }
    }
    attribute.value = positions;
    console.log(`finishing calc positions after ${performance.now() - timeB}ms`);
  }

  calculateColors(attribute) {
    const {data, getColor} = this.props;
    const colors = new Float32Array(data.length * 2 * 3);

    let index = 0;
    for (let i = 0; i < data.length; i++) {
      const color = getColor(data[i]);
      const l = 2;
      for (let j = 0; j < l; j++) {
        colors[index++] = color[0];
        colors[index++] = color[1];
        colors[index++] = color[2];
      }
    }
    attribute.value = colors;
  }
}

TripsLayer.layerName = 'TripsLayer';
TripsLayer.defaultProps = defaultProps;
