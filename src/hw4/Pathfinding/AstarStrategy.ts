import Stack from "../../Wolfie2D/DataTypes/Collections/Stack";
import Vec2 from "../../Wolfie2D/DataTypes/Vec2";
import NavigationPath from "../../Wolfie2D/Pathfinding/NavigationPath";
import NavPathStrat from "../../Wolfie2D/Pathfinding/Strategies/NavigationStrategy";
import GraphUtils from "../../Wolfie2D/Utils/GraphUtils";

// TODO Construct a NavigationPath object using A*

/**
 * The AstarStrategy class is an extension of the abstract NavPathStrategy class. For our navigation system, you can
 * now specify and define your own pathfinding strategy. Originally, the two options were to use Djikstras or a
 * direct (point A -> point B) strategy. The only way to change how the pathfinding was done was by hard-coding things
 * into the classes associated with the navigation system. 
 * 
 * - Peter
 */

interface nodeInfo {
    node: number;
    gscore: number;
    hscore: number;
    parent: number;
}

function findNode(node: number, set) {
    for (const node of set) {
      if (node.node === node) {
        return node;
      }
    }
    return undefined;
  }

function h(start: number, end: number, mesh) {
    // console.log("bleh: ", mesh.graph.getNodePosition(start));
    return mesh.graph.getNodePosition(start).distanceTo(mesh.graph.getNodePosition(end));
}


export default class AstarStrategy extends NavPathStrat {
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        const start = this.mesh.graph.snap(from);
        const target = this.mesh.graph.snap(to);

        let parents = new Map<number, number>();
        let gscore = new Map<number, number>();
        gscore.set(start, 0);
        let openset = new Set<number>();
        openset.add(start);
        while (openset.size > 0) {
            let curr = Array.from(openset).reduce((a, b) => {
                return (gscore.get(a) + h(a, target, this.mesh)) < (gscore.get(b) + h(b, target, this.mesh)) ? a : b;
            });

            // console.log("curr: ", curr);
            openset.delete(curr);
            if (curr === target) {
                break; // Exit early if target node reached
            }

            let edges = this.mesh.graph.edges[curr];
            while (edges != null && edges !== undefined) {
                const neighbor = edges.y;
                const tentative_gscore = gscore.get(curr) + edges.weight;
                
                if (!gscore.has(neighbor) || tentative_gscore < gscore.get(neighbor)) {
                    // Update g-score and parent if necessary
                    gscore.set(neighbor, tentative_gscore);
                    parents.set(neighbor, curr);
                    openset.add(neighbor);
                }
                edges = edges.next;
            }
        }
        // Reconstruct path
        let path = new Stack<Vec2>(this.mesh.graph.numVertices);
        let current = target;
        while (parents.has(current)) {
            path.push(this.mesh.graph.getNodePosition(current));
            current = parents.get(current);
            // console.log("curr:", current);
        }
        path.push(from); // Add start node
        return new NavigationPath(path);
    }
}