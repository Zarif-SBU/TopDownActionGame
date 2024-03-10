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

function h(start: number, end: number) {
    return this.mesh.graph.getNodePosition(start).distanceTo(this.mesh.graph.getNodePosition(end));
}


export default class AstarStrategy extends NavPathStrat {

    /**
     * @see NavPathStrat.buildPath()
     */
    public buildPath(to: Vec2, from: Vec2): NavigationPath {
        const start = this._mesh.graph.snap(from);
        const target = this.mesh.graph.snap(to);
        let path = new Stack<Vec2>(this.mesh.graph.numVertices);
        
        let gscore = new Map<number, number>();
        let fscore = new Map<number, number>();
        
        gscore.set(start, 0);
        fscore.set(start, h(start, target));

        let openset = new Set<number>();
        openset.add(start);
        while(openset.size > 0) {
            let curr = openset[0];
            openset.forEach(node => {
                if(fscore.get(node) < fscore.get(curr)) {
                    curr = node;
                }
            });
            this.mesh.graph.edges
        }
        return new NavigationPath(new Stack());

    }
}