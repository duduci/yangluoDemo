define(["./arrayRemoveDuplicates-3fea1e5f","./Transforms-79117a7b","./Cartesian2-8646c5a1","./Check-24483042","./ComponentDatatype-1a100acd","./CoplanarPolygonGeometryLibrary-32520d7a","./when-54335d57","./GeometryAttribute-374f805d","./GeometryAttributes-caa08d6c","./GeometryInstance-6aa9010a","./GeometryPipeline-571ff4c9","./IndexDatatype-82ceea78","./PolygonGeometryLibrary-2a7648d9","./Math-d6182036","./RuntimeError-88a32665","./WebGLConstants-95ceb4e9","./OrientedBoundingBox-eb360dc3","./EllipsoidTangentPlane-325a8e68","./IntersectionTests-5394f658","./Plane-13ae4b1b","./AttributeCompression-10c27d9c","./EncodedCartesian3-bf827957","./ArcType-2b58731c","./EllipsoidRhumbLine-2b7999f3","./PolygonPipeline-97a7160d"],function(i,y,l,e,c,p,o,s,u,d,m,g,f,t,r,n,a,h,b,P,G,v,L,C,T){"use strict";function E(e){e=(e=o.defaultValue(e,o.defaultValue.EMPTY_OBJECT)).polygonHierarchy;this._polygonHierarchy=e,this._workerName="createCoplanarPolygonOutlineGeometry",this.packedLength=f.PolygonGeometryLibrary.computeHierarchyPackedLength(e)+1}E.fromPositions=function(e){return new E({polygonHierarchy:{positions:(e=o.defaultValue(e,o.defaultValue.EMPTY_OBJECT)).positions}})},E.pack=function(e,t,r){return r=o.defaultValue(r,0),t[r=f.PolygonGeometryLibrary.packPolygonHierarchy(e._polygonHierarchy,t,r)]=e.packedLength,t};var k={polygonHierarchy:{}};return E.unpack=function(e,t,r){t=o.defaultValue(t,0);var n=f.PolygonGeometryLibrary.unpackPolygonHierarchy(e,t);t=n.startingIndex,delete n.startingIndex;t=e[t];return(r=!o.defined(r)?new E(k):r)._polygonHierarchy=n,r.packedLength=t,r},E.createGeometry=function(e){var t=e._polygonHierarchy,e=t.positions,e=i.arrayRemoveDuplicates(e,l.Cartesian3.equalsEpsilon,!0);if(!(e.length<3)&&p.CoplanarPolygonGeometryLibrary.validOutline(e)){var r=f.PolygonGeometryLibrary.polygonOutlinesFromHierarchy(t,!1);if(0!==r.length){for(var n=[],o=0;o<r.length;o++){var a=new d.GeometryInstance({geometry:function(e){for(var t=e.length,r=new Float64Array(3*t),n=g.IndexDatatype.createTypedArray(t,2*t),o=0,a=0,i=0;i<t;i++){var y=e[i];r[o++]=y.x,r[o++]=y.y,r[o++]=y.z,n[a++]=i,n[a++]=(i+1)%t}var l=new u.GeometryAttributes({position:new s.GeometryAttribute({componentDatatype:c.ComponentDatatype.DOUBLE,componentsPerAttribute:3,values:r})});return new s.Geometry({attributes:l,indices:n,primitiveType:s.PrimitiveType.LINES})}(r[o])});n.push(a)}e=m.GeometryPipeline.combineInstances(n)[0],t=y.BoundingSphere.fromPoints(t.positions);return new s.Geometry({attributes:e.attributes,indices:e.indices,primitiveType:e.primitiveType,boundingSphere:t})}}},function(e,t){return(e=o.defined(t)?E.unpack(e,t):e)._ellipsoid=l.Ellipsoid.clone(e._ellipsoid),E.createGeometry(e)}});